import os
import io
import uuid
import requests
import numpy as np
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from PIL import Image
import psycopg2
from pgvector.psycopg2 import register_vector

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['MAX_CONTENT_LENGTH'] = int(os.getenv('MAX_CONTENT_LENGTH', 10485760))
DATABASE_URL = os.getenv('DATABASE_URL')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_KEY')
SUPABASE_BUCKET = os.getenv('SUPABASE_BUCKET')
FEATURE_VECTOR_DIM = int(os.getenv('FEATURE_VECTOR_DIM', 1280))
PORT = int(os.getenv('PORT', 8081))


def get_db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    register_vector(conn)
    return conn


def save_image_record(image_url, feature_vector):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    image_id = str(uuid.uuid4())
    uploaded_at = datetime.now()
    
    cursor.execute(
        "INSERT INTO image_records (id, image_url, feature_vector, uploaded_at) VALUES (%s, %s, %s, %s)",
        (image_id, image_url, feature_vector, uploaded_at)
    )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return image_id


def search_similar_images(query_vector, similarity_threshold=0.7, max_results=50):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    vector_list = query_vector.tolist() if isinstance(query_vector, np.ndarray) else query_vector
    
    cursor.execute("""
        SELECT 
            id,
            image_url,
            (1 - (feature_vector <=> %s::vector)) AS similarity
        FROM image_records
        WHERE (1 - (feature_vector <=> %s::vector)) >= %s
        ORDER BY feature_vector <=> %s::vector
        LIMIT %s
    """, (vector_list, vector_list, similarity_threshold, vector_list, max_results))
    
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    
    similar_images = []
    for img_id, img_url, similarity in results:
        similar_images.append({
            'imageId': str(img_id),
            'imageUrl': img_url,
            'similarityScore': float(similarity)
        })
    
    return similar_images


def upload_to_supabase(image_data, filename):
    upload_url = f"{SUPABASE_URL}/storage/v1/object/{SUPABASE_BUCKET}/{filename}"
    
    headers = {
        'Authorization': f'Bearer {SUPABASE_SERVICE_KEY}',
        'Content-Type': 'image/jpeg'
    }
    
    response = requests.post(upload_url, data=image_data, headers=headers)
    
    if response.status_code not in [200, 201]:
        raise Exception(f"Supabase upload failed: HTTP {response.status_code}")
    
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/{SUPABASE_BUCKET}/{filename}"
    
    return public_url


def preprocess_image(image_data):
    image = Image.open(io.BytesIO(image_data))
    
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    target_size = (224, 224)
    image = image.resize(target_size, Image.Resampling.LANCZOS)
    
    img_array = np.array(image).astype(np.float32) / 255.0
    
    return img_array


def extract_features(image_data):
    img_array = preprocess_image(image_data)
    
    features = []
    
    grid_size = 8
    h, w, c = img_array.shape
    cell_h = h // grid_size
    cell_w = w // grid_size
    
    for gy in range(grid_size):
        for gx in range(grid_size):
            for channel in range(c):
                cell = img_array[
                    gy*cell_h:(gy+1)*cell_h,
                    gx*cell_w:(gx+1)*cell_w,
                    channel
                ]
                
                mean = np.mean(cell)
                std = np.std(cell)
                
                features.append(mean)
                features.append(std)
    
    features = np.array(features)
    if len(features) < FEATURE_VECTOR_DIM:
        features = np.pad(features, (0, FEATURE_VECTOR_DIM - len(features)))
    else:
        features = features[:FEATURE_VECTOR_DIM]
    
    norm = np.linalg.norm(features)
    if norm > 0:
        features = features / norm
    
    return features


def download_image(image_url):
    response = requests.get(image_url, timeout=10)
    
    if response.status_code != 200:
        raise Exception(f"Failed to download image: HTTP {response.status_code}")
    
    return response.content


def generate_unique_filename(original_filename):
    try:
        ext = original_filename.rsplit('.', 1)[1] if '.' in original_filename else 'jpg'
        unique_filename = f"{int(datetime.now().timestamp() * 1000)}_{uuid.uuid4()}.{ext}"
        return unique_filename
    except Exception:
        return f"{int(datetime.now().timestamp() * 1000)}_image.jpg"


def validate_image(filename):
    allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    return ext in allowed_extensions


@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        timestamp = int(datetime.now().timestamp() * 1000)
        return jsonify({
            'status': 'OK',
            'timestamp': timestamp,
            'message': 'Image Similarity API is running'
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'ERROR',
            'timestamp': int(datetime.now().timestamp() * 1000),
            'message': f'Health check failed: {str(e)}'
        }), 500


@app.route('/api/search', methods=['POST'])
def search_similar():
    try:
        image_file = request.files.get('image')
        image_url = request.form.get('imageUrl')
        similarity_threshold = float(request.form.get('similarityThreshold', 0.7))
        
        if image_file:
            image_data = image_file.read()
            filename = image_file.filename
        elif image_url:
            image_data = download_image(image_url)
            filename = image_url.split('/')[-1]
        else:
            return jsonify({
                'success': False,
                'error': 'Either image file or imageUrl must be provided'
            }), 400
        
        if not validate_image(filename):
            return jsonify({
                'success': False,
                'error': 'Invalid image format. Supported formats: jpg, jpeg, png, gif, bmp'
            }), 400
        
        unique_filename = generate_unique_filename(filename)
        uploaded_url = upload_to_supabase(image_data, unique_filename)
        
        feature_vector = extract_features(image_data)
        image_id = save_image_record(uploaded_url, feature_vector.tolist())
        
        similar_images = search_similar_images(feature_vector, similarity_threshold)
        
        return jsonify({
            'success': True,
            'count': len(similar_images),
            'similarImages': similar_images
        }), 200
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to process image: {str(e)}'
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)

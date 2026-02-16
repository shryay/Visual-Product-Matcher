"""
Database initialization script for Flask Image Similarity API
Enables pgvector extension and creates the image_records table
"""

import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')

def init_database():
    """Initialize database with pgvector extension and image_records table"""
    print("Connecting to database...")
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("✓ Connected successfully")
        
        # Enable pgvector extension
        print("\nEnabling pgvector extension...")
        cursor.execute("CREATE EXTENSION IF NOT EXISTS vector;")
        print("✓ pgvector extension enabled")
        
        # Create image_records table
        print("\nCreating image_records table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS image_records (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                image_url VARCHAR(500) NOT NULL,
                feature_vector vector(1280) NOT NULL,
                uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        """)
        print("✓ image_records table created")
        
        # Create index for similarity search
        print("\nCreating vector similarity index...")
        cursor.execute("""
            CREATE INDEX IF NOT EXISTS image_records_feature_vector_idx 
            ON image_records USING ivfflat (feature_vector vector_cosine_ops)
            WITH (lists = 100);
        """)
        print("✓ Vector similarity index created")
        
        # Commit changes
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("✅ Database initialization complete!")
        print("="*60)
        print("\nYou can now run the Flask application:")
        print("  python app.py")
        
    except Exception as e:
        print(f"\n❌ Error initializing database: {str(e)}")
        raise


if __name__ == "__main__":
    print("="*60)
    print("Flask Image Similarity API - Database Setup")
    print("="*60)
    init_database()

# Flask Image Similarity API - cURL Commands

## Deployed API URL
```
https://flask-image-similarity.onrender.com
```

## API Endpoints

### 1. Health Check

**Endpoint:** `GET /api/health`

**cURL Command:**
```bash
curl https://flask-image-similarity.onrender.com/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": 1771252891039,
  "message": "Image Similarity API is running"
}
```

---

### 2. Image Search - URL Upload

**Endpoint:** `POST /api/search`

**cURL Command:**
```bash
curl -X POST https://flask-image-similarity.onrender.com/api/search \
  -F "imageUrl=https://images.pexels.com/photos/9225154/pexels-photo-9225154.jpeg" \
  -F "similarityThreshold=0.7"
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "similarImages": [
    {
      "imageId": "353ab143-7c7c-4019-b641-c41c30ab02a6",
      "imageUrl": "https://aecxeoalnttotzfvuejp.supabase.co/storage/v1/object/public/images/...",
      "similarityScore": 1.0
    }
  ]
}
```

---

### 3. Image Search - File Upload

**Endpoint:** `POST /api/search`

**cURL Command:**
```bash
curl -X POST https://flask-image-similarity.onrender.com/api/search \
  -F "image=@/path/to/your/image.jpg" \
  -F "similarityThreshold=0.7"
```

**Windows Example:**
```powershell
curl -X POST https://flask-image-similarity.onrender.com/api/search `
  -F "image=@C:\Users\mypc\Pictures\image.jpg" `
  -F "similarityThreshold=0.7"
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "similarImages": [...]
}
```

---

## Parameters

### Image Search Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `image` | File | Optional* | - | Image file to upload |
| `imageUrl` | String | Optional* | - | URL of the image to search |
| `similarityThreshold` | Float | Optional | 0.7 | Minimum similarity score (0.0-1.0) |

*Either `image` or `imageUrl` must be provided.

---

## Example Usage

### Test with Sample Image
```bash
curl -X POST https://flask-image-similarity.onrender.com/api/search \
  -F "imageUrl=https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0" \
  -F "similarityThreshold=0.8"
```

### Upload Local File (Linux/Mac)
```bash
curl -X POST https://flask-image-similarity.onrender.com/api/search \
  -F "image=@./screenshot.png" \
  -F "similarityThreshold=0.7"
```

### Upload Local File (Windows PowerShell)
```powershell
curl -X POST https://flask-image-similarity.onrender.com/api/search `
  -F "image=@C:\Users\mypc\Pictures\Screenshots\screenshot.png" `
  -F "similarityThreshold=0.7"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Either image file or imageUrl must be provided"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to process image: [error details]"
}
```

---

## Deployment Information

- **Docker Hub:** `docker pull shryay/flask-image-similarity:latest`
- **Live API:** https://flask-image-similarity.onrender.com
- **Supported Formats:** JPG, JPEG, PNG, GIF, BMP
- **Max File Size:** 10MB
- **Feature Vector:** 1280 dimensions
- **Max Results:** 50 similar images

# Visual Product Matcher - Frontend

An attractive, modern web application for finding similar products using AI-powered image recognition.

## Features

✨ **Dual Upload Methods**
- Upload images directly from your device
- Or provide an image URL

🎯 **Smart Matching**
- Adjustable similarity threshold (0.0 - 1.0)
- Real-time results with similarity scores
- Beautiful grid layout for results

🎨 **Modern UI/UX**
- Gradient designs with purple/pink theme
- Responsive design for all screen sizes
- Smooth animations and transitions
- Loading states and error handling

## Getting Started

### Prerequisites
- Node.js installed on your system

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies (if not already installed):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit the URL shown in the terminal (typically `http://localhost:5173`)

## How to Use

1. **Choose Upload Method**
   - Click "Upload File" to select an image from your device
   - Or click "Image URL" to provide a direct link to an image

2. **Upload Your Image**
   - Drag and drop or click to browse for a file
   - Or paste an image URL (e.g., from Unsplash, Pexels, etc.)

3. **Adjust Similarity Threshold**
   - Use the slider to set how similar results should be
   - Higher values (closer to 1.0) = more similar results
   - Lower values (closer to 0.0) = broader results

4. **Find Similar Products**
   - Click "Find Similar Products" to search
   - View your uploaded image preview
   - See matching results with similarity percentages

## API Integration

The frontend connects to the Flask Image Similarity API:
- **API URL**: `https://flask-image-similarity.onrender.com`
- **Endpoint**: `POST /api/search`

### API Parameters
- `image`: Image file (when using file upload)
- `imageUrl`: Image URL (when using URL method)
- `similarityThreshold`: Float between 0.0 and 1.0

### API Response
```json
{
  "success": true,
  "count": 4,
  "similarImages": [
    {
      "imageId": "uuid",
      "imageUrl": "https://...",
      "similarityScore": 0.95
    }
  ]
}
```

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **Fetch API** - HTTP requests

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Preview Production Build

```bash
npm run preview
```

## Troubleshooting

**API Connection Issues:**
- The API is hosted on Render and may take 30-60 seconds to wake up on first request
- Check your internet connection
- Verify the API is running: `https://flask-image-similarity.onrender.com/api/health`

**Image Upload Issues:**
- Maximum file size: 10MB
- Supported formats: JPG, JPEG, PNG, GIF, BMP
- For URLs, ensure the image is publicly accessible

**No Results Found:**
- Try lowering the similarity threshold
- Use a different image
- Check if the database has similar products

## License

MIT

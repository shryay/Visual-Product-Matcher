import { useState } from 'react'
import config from './config'

function App() {
  const [uploadMethod, setUploadMethod] = useState('file') // 'file' or 'url'
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const API_BASE_URL = config.backendUrl

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResults(null)
      setError(null)
    }
  }

  const handleUrlChange = (e) => {
    const url = e.target.value
    setImageUrl(url)
    if (url) {
      // Test if URL loads as image
      const img = new Image()
      img.onload = () => {
        setPreviewUrl(url)
        setError(null)
      }
      img.onerror = () => {
        setPreviewUrl(null)
        setError('Unable to load image from URL. Please use a direct image link (e.g., ending in .jpg, .png, .gif)')
      }
      img.src = url
      setResults(null)
    } else {
      setPreviewUrl(null)
      setError(null)
    }
  }

  const handleSearch = async () => {
    if (!imageFile && !imageUrl) {
      setError('Please upload an image or provide an image URL')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const formData = new FormData()

      if (uploadMethod === 'file' && imageFile) {
        formData.append('image', imageFile)
      } else if (uploadMethod === 'url' && imageUrl) {
        formData.append('imageUrl', imageUrl)
      }

      formData.append('similarityThreshold', similarityThreshold)

      console.log('Sending request to:', `${API_BASE_URL}/api/search`)
      console.log('Upload method:', uploadMethod)
      console.log('Similarity threshold:', similarityThreshold)

      const response = await fetch(`${API_BASE_URL}/api/search`, {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        setError(`API Error (${response.status}): ${errorText}`)
        return
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setResults(data)
      } else {
        setError(data.error || 'Failed to search for similar images')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError(`Failed to connect to the API: ${err.message}. The API might be waking up (takes 30-60 seconds on first request).`)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setImageFile(null)
    setImageUrl('')
    setPreviewUrl(null)
    setResults(null)
    setError(null)
    setSimilarityThreshold(0.7)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Visual Product Matcher
              </h1>
              <p className="text-gray-600 mt-1">Find similar products using AI-powered image recognition</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Powered
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Image</h2>

          {/* Upload Method Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setUploadMethod('file')
                setImageUrl('')
                setPreviewUrl(null)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${uploadMethod === 'file'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload File
              </div>
            </button>
            <button
              onClick={() => {
                setUploadMethod('url')
                setImageFile(null)
                setPreviewUrl(null)
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${uploadMethod === 'url'
                  ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Image URL
              </div>
            </button>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="mb-6">
              <label className="block w-full cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors bg-gray-50 hover:bg-purple-50">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-purple-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <div className="mb-6">
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <span className="font-semibold">💡 Tip:</span> Use direct image URLs from:
                  <span className="block mt-1 ml-4">
                    • <a href="https://images.unsplash.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Unsplash</a> (right-click image → Copy image address)
                    <br />
                    • <a href="https://images.pexels.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Pexels</a> (right-click image → Copy image address)
                    <br />
                    • Any URL ending in .jpg, .jpeg, .png, .gif, .bmp
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Preview */}
          {previewUrl && (
            <div className="mb-6 bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                  setError('Image failed to load. Please check the URL and try again.')
                  setPreviewUrl(null)
                }}
              />
            </div>
          )}

          {/* Similarity Threshold Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Similarity Threshold</label>
              <span className="text-sm font-semibold text-purple-600">{similarityThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Less Similar (0.0)</span>
              <span>More Similar (1.0)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading || (!imageFile && !imageUrl)}
              className="flex-1 bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find Similar Products
                </div>
              )}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Similar Products Found</h2>
                <p className="text-gray-600 mt-1">
                  Found {results.count} {results.count === 1 ? 'match' : 'matches'} above {(similarityThreshold * 100).toFixed(0)}% similarity
                </p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold">
                {results.count} Results
              </div>
            </div>

            {results.count === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No similar products found</h3>
                <p className="mt-2 text-gray-600">Try lowering the similarity threshold or uploading a different image</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.similarImages.map((image, index) => (
                  <div key={image.imageId} className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-1">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={`Similar product ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E'
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-800">
                              {(image.similarityScore * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500">Match #{index + 1}</span>
                        <a
                          href={image.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 text-xs font-medium flex items-center gap-1"
                        >
                          View
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8 text-center text-gray-600 text-sm">
        <p>Powered by AI Image Similarity API</p>
      </footer>
    </div>
  )
}

export default App

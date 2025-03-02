"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    youtube: false,
    facebook: false,
    instagram: false,
    tiktok: false
  });
  const [postingStatus, setPostingStatus] = useState({
    isPosting: false,
    results: null,
    error: null
  });
  const fileInputRef = useRef(null);

  const platforms = [
    {
      id: "youtube",
      name: "YouTube",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
      connected: false
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.64c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.736-.9 10.125-5.864 10.125-11.854z" />
        </svg>
      ),
      connected: false
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: (
        <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      connected: false
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      ),
      connected: false
    }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMediaFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => ({
      ...prev,
      [platformId]: !prev[platformId]
    }));
  };

  const handlePost = async () => {
    if (!postContent && !mediaFile) {
      alert("Please add text or upload media");
      return;
    }
    
    if (!Object.values(selectedPlatforms).some(v => v)) {
      alert("Please select at least one platform");
      return;
    }

    setPostingStatus({
      isPosting: true,
      results: null,
      error: null
    });
    
    try {
      const formData = new FormData();
      formData.append("title", postTitle);
      formData.append("content", postContent);
      if (mediaFile) formData.append("media", mediaFile);
      
      // Add selected platforms
      Object.keys(selectedPlatforms).forEach(platform => {
        if (selectedPlatforms[platform]) {
          formData.append("platforms[]", platform);
        }
      });

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 300);

      // API call would go here
      const response = await fetch("/api/social/post", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();
      
      setTimeout(() => {
        setPostingStatus({
          isPosting: false,
          results: result,
          error: null
        });
        
        if (response.ok) {
          // Clear form on successful post
          setPostContent("");
          setPostTitle("");
          setMediaFile(null);
          setMediaPreview(null);
          setUploadProgress(0);
          
          // Navigate to posts page after success
          router.push("/dashboard/posts");
        }
      }, 500); // Small delay to show 100% completion
      
    } catch (error) {
      console.error("Error posting content:", error);
      setPostingStatus({
        isPosting: false,
        results: null,
        error: "Failed to post content. Please try again."
      });
      setUploadProgress(0);
    }
  };

  const connectAccount = (platform) => {
    window.location.href = `/api/auth/${platform}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Create New Post</h1>
        <p className="text-gray-600">Share your content across multiple platforms</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Post Title</label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-green-400"
            placeholder="Add a title to your post"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-400 focus:border-green-400 min-h-[120px]"
            placeholder="What do you want to share?"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Media</label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 ${mediaPreview ? 'border-green-400' : 'border-gray-300'}`}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
            />
            
            {mediaPreview ? (
              <div className="relative w-full">
                {mediaFile.type.startsWith('image/') ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="mx-auto max-h-64 rounded-md" 
                  />
                ) : (
                  <video 
                    src={mediaPreview} 
                    controls 
                    className="mx-auto max-h-64 rounded-md" 
                  />
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setMediaFile(null);
                    setMediaPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div className="text-green-400 mb-3">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">Image or Video (max 100MB)</p>
              </>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Platforms</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {platforms.map(platform => (
              <div 
                key={platform.id} 
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                  selectedPlatforms[platform.id] 
                    ? 'border-green-400 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => platform.connected ? togglePlatform(platform.id) : connectAccount(platform.id)}
              >
                {platform.icon}
                <span className="mt-2 font-medium">{platform.name}</span>
                {!platform.connected && (
                  <span className="mt-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    Not connected
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
          Cancel
        </Link>
        
        <button 
          onClick={handlePost}
          disabled={postingStatus.isPosting}
          className={`px-5 py-2 rounded-md font-medium ${
            postingStatus.isPosting 
              ? 'bg-gray-300 text-gray-700' 
              : 'bg-green-400 hover:bg-green-500 text-gray-800'
          }`}
        >
          {postingStatus.isPosting ? 'Posting...' : 'Post Now'}
        </button>
      </div>
      
      {/* Upload Progress */}
      {postingStatus.isPosting && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-400 h-2 rounded-full transition-all duration-300" 
              style={{width: `${uploadProgress}%`}}
            />
          </div>
        </div>
      )}
      
      {/* Results or Error */}
      {(postingStatus.results || postingStatus.error) && (
        <div className={`mt-4 p-4 rounded-md ${postingStatus.error ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
          {postingStatus.error ? (
            <p className="text-red-600">{postingStatus.error}</p>
          ) : (
            <div>
              <p className="text-green-700 font-medium mb-2">Posted successfully!</p>
              <pre className="text-sm bg-white p-3 rounded border border-gray-200 overflow-auto">
                {JSON.stringify(postingStatus.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
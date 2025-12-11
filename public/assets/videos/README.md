# 🎥 How to Add Your Demo Video

## 📁 Step 1: Copy Your Video File

Copy your video file to this folder:
```
/public/assets/videos/
```

### Supported Video Formats:
- **MP4** (recommended) - Best compatibility
- **WebM** - Good for modern browsers  
- **OGG** - Fallback for some browsers

### Recommended Settings:
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Aspect Ratio**: 16:9
- **File Size**: Under 50MB for web performance
- **Codec**: H.264 for MP4

## 📝 Step 2: Update Video Information

### In `/src/components/demo-video-modal.tsx`:

Find this section and update:
```javascript
{
  id: 1,
  title: "Your Video Title",                    // ← Change this
  description: "Your video description",        // ← Change this  
  thumbnail: "/assets/img/hero.jpg",            // ← Change thumbnail if you have one
  videoUrl: "/assets/videos/your-video.mp4",    // ← Change to your video filename
  embedUrl: "",                                 // ← Keep empty for local videos
  duration: "3:45"                              // ← Update with actual duration
}
```

### Example:
```javascript
{
  id: 1,
  title: "AI Interview Demo - Complete Walkthrough",
  description: "See how our AI conducts realistic interviews with natural conversation",
  thumbnail: "/assets/img/hero.jpg",
  videoUrl: "/assets/videos/my-demo-video.mp4",  // ← Your actual filename
  embedUrl: "",
  duration: "5:30"
}
```

## 🖼️ Step 3: Add Video Thumbnail (Optional)

If you have a custom thumbnail:
1. Save it as JPG/PNG in `/public/assets/img/`
2. Update the `thumbnail` path in the video object

## ✅ Step 4: Test Your Video

1. Make sure your video file is in `/public/assets/videos/`
2. Check the filename matches exactly in the code
3. Visit your app and click "Watch Demo"
4. Your video should play in the modal!

## 🔧 Current File Structure:
```
public/
  assets/
    videos/              ← Put your video here
      demo-video.mp4     ← Your video file
      (other videos...)
    img/
      hero.jpg           ← Thumbnail images
      office.jpg
      bg.png
```

## 🎯 Quick Start:

1. **Copy your video** → `/public/assets/videos/demo-video.mp4`
2. **Update the filename** in the code if different
3. **Update title/description** to match your video content
4. **Test** by clicking "Watch Demo" button

That's it! Your video will now play in the demo modal and demo page! 🚀

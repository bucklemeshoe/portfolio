# 📸 Media Bank Functionality Guide

## Overview
The Media Bank is a built-in image management system that allows you to upload, organize, and insert images into your blog posts and case studies. It provides a seamless workflow for managing visual content across your portfolio with clean, optimized file paths.

## 🎯 Where Media Bank Works

### ✅ Available In:
- **New Post Creation** (`/admin/content`)
- **Edit Existing Posts** (`/admin/edit/[id]`)
- **Media Bank Tab** (`/admin/dashboard` → Media Bank tab)

### ❌ Not Available In:
- Public website pages
- Admin dashboard main view
- Site configuration pages

## 🔧 How to Use Media Bank

### 1. Accessing Media Bank

#### Method A: Via Dashboard Tab
1. Go to `/admin/dashboard`
2. Click the **"Media Bank"** tab in the header navigation
3. Upload, search, and manage all your images

#### Method B: While Writing Content (Recommended)
1. Open any post for editing (`/admin/content` or `/admin/edit/[id]`)
2. Click in the **"Body Content"** text area
3. Type `/` (forward slash) anywhere in the content
4. Media Bank popup will automatically open

### 2. Uploading Images

#### From Media Bank Tab:
1. Click **"Media Bank"** tab in dashboard
2. Drag & drop images to the upload area, or click to browse
3. Supported formats: PNG, JPG, GIF (up to 10MB each)
4. Images are automatically saved to `/public/media/`
5. **Auto-compression**: Large images are automatically compressed for optimal web performance

#### From Content Editor:
1. Type `/` in the content field to open Media Bank popup
2. If no images exist, upload new ones using the interface
3. Images are immediately available for insertion

### 3. Inserting Images into Content

#### Step-by-Step:
1. **Position Cursor**: Click where you want the image in your content
2. **Trigger Media Bank**: Type `/` (forward slash)
3. **Media Bank Opens**: Popup displays all available images
4. **Search (Optional)**: Use search box to find specific images
5. **Select Image**: Click on any image or the eye icon
6. **Auto-Insert**: Markdown is automatically inserted at cursor position

#### Example Output:
When you select an image, this markdown is inserted:
```markdown
![E-commerce platform interface](/media/ecommerce-screenshot.jpg)
```

## 📁 File Storage & Organization

### Directory Structure:
```
public/
├── media/                    # All uploaded images (NEW)
│   ├── screenshot-1.jpg
│   ├── wireframe-design.png
│   └── user-flow.gif
└── images/                   # Pre-existing images
    ├── case-studies/
    ├── portfolio/
    ├── travel/
    └── misc/
```

### File Naming:
- **Uploaded files**: Keep original filename (spaces converted to hyphens)
- **Public paths**: Clean URLs like `/media/filename.jpg`
- **No data URLs**: All new uploads create real file paths
- **SEO-friendly**: Clean URLs improve search engine optimization

## 🎨 Supported Image Types

### ✅ Supported Formats:
- **PNG** - Best for graphics, logos, screenshots
- **JPG/JPEG** - Best for photos, complex images
- **GIF** - Supports animation

### 📏 File Limits:
- **Maximum size**: 10MB per file
- **Multiple uploads**: Yes, select multiple files at once
- **Auto-compression**: Images automatically compressed to JPEG format, max 800px width, 0.7 quality
- **Storage optimization**: Only 50 most recent images kept in localStorage to prevent quota issues

## 🔍 Search & Organization

### Search Functionality:
- Search by **filename**
- Search by **alt text**
- Search by **tags** (currently: "uploaded")
- Real-time filtering as you type

### Image Information:
Each image shows:
- **Thumbnail preview**
- **Original filename**
- **File size** (formatted: KB, MB)
- **Upload date**
- **Usage count** (how many posts use this image)
- **Tags** (currently "uploaded" for all new images)

## 📝 Markdown Integration

### Generated Markdown Format:
```markdown
![Alt Text](Image Path)
```

### Example Outputs:
```markdown
![Screenshot of homepage](/media/homepage-screenshot.png)
![User wireframe design](/media/wireframe-v2.jpg)
![Product photo](/media/product-hero-image.jpg)
```

### How It Renders:
- **Alt text**: Used for accessibility and SEO
- **Image path**: Direct link to optimized image
- **Responsive**: Automatically responsive in blog posts
- **Optimized**: Next.js Image component handles optimization
- **Clean URLs**: All images use proper file paths instead of data URLs

## 🎯 Workflow Examples

### Creating a New Blog Post:
1. Go to `/admin/content`
2. Fill in title, select type (Thoughts/Case Studies)
3. In the body content, write your text
4. When you need an image, type `/`
5. Select image from Media Bank
6. Continue writing around the inserted image
7. Save when complete

### Editing Existing Post:
1. Go to `/admin/dashboard`
2. Click **"Edit"** on any existing post
3. Navigate to the body content area
4. Position cursor where you want to add an image
5. Type `/` to open Media Bank
6. Select and insert image
7. Save changes

### Adding Multiple Images:
1. Type `/` for first image location
2. Select first image
3. Continue writing text
4. Type `/` again for second image location
5. Select second image
6. Repeat as needed

## 🛠️ Technical Details

### Image Processing:
- **Upload API**: `/pages/api/upload-media.ts`
- **Storage location**: `/public/media/`
- **URL format**: `/media/filename.ext`
- **Optimization**: Next.js Image component handles optimization
- **Compression**: Client-side compression before upload (JPEG, 800px max width, 0.7 quality)

### Data Persistence:
- **Image metadata**: Stored in browser localStorage (limited to 50 most recent)
- **Actual files**: Saved to server filesystem
- **Content**: Images referenced by clean file paths
- **Error handling**: Graceful handling of localStorage quota exceeded

### Browser Compatibility:
- **Modern browsers**: Full functionality
- **File API**: Required for drag & drop uploads
- **localStorage**: Required for image metadata
- **Canvas API**: Used for image compression

## ❗ Important Notes

### File Management:
- **No deletion from content editor**: Remove images via Media Bank tab
- **Filename conflicts**: Newer files may overwrite existing ones
- **Clean URLs**: All new uploads generate clean, SEO-friendly paths
- **Storage limits**: localStorage limited to 50 most recent images to prevent quota issues

### Content Integration:
- **Markdown only**: Images inserted as markdown syntax
- **Manual positioning**: Type `/` exactly where you want the image
- **Live preview**: Use preview mode to see how images will look
- **Case study images**: Hero images use `object-cover` (fill), contextual images use `object-contain` (fit)

### Performance:
- **Lazy loading**: Images load as needed
- **Responsive images**: Automatically sized for different screens
- **Caching**: Images cached by browser for fast loading
- **Compression**: Automatic compression reduces file sizes and improves loading times

## 🔄 Migration Notes

### Existing Images:
- **Pre-existing images**: Continue to work normally
- **Old localStorage images**: May still use data URLs but function correctly
- **New uploads**: Will always use clean file paths
- **Case study images**: Fixed duplicate image issue - images now display once in proper locations

### Upgrading Workflow:
- No action needed for existing content
- New images automatically use improved system
- Gradually replace old data URLs with clean paths by re-uploading if desired
- Case study images now properly display without duplicates

## 🆕 Recent Improvements

### Image Display Options:
- **Hero images**: Can be set to "Fill" (crop to fit) or "Fit" (show full image) in CMS
- **Case study images**: Header images use fill, contextual images use fit
- **Live preview**: See how images will display before saving

### Performance Enhancements:
- **Auto-compression**: Large images automatically compressed
- **Storage optimization**: Prevents localStorage quota issues
- **Clean URLs**: All new uploads use proper file paths
- **Error handling**: Graceful handling of storage limits

### User Experience:
- **Visual feedback**: Clear indication of image display options
- **Consistent interface**: Same functionality across create and edit pages
- **Improved search**: Better image discovery and organization

---

## 🎉 Quick Start

1. **Go to**: `/admin/content` (new post) or `/admin/edit/[id]` (existing post)
2. **Click in**: Body content text area
3. **Type**: `/` where you want an image
4. **Upload**: New images if needed
5. **Click**: Any image to insert it
6. **Continue**: Writing around your inserted images
7. **Save**: Your post with embedded images

**That's it! Your images are now part of your content with clean, optimized paths and proper display options.**
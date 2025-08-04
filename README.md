# 🎨 Jared Buckley - Portfolio Site

A modern, beautiful portfolio website built with Next.js, Tailwind CSS, and the spotlight template. Showcasing Jared's work as a Consulting Product Designer.

## ✨ Features

- **Modern Design**: Clean, professional design with spotlight effects
- **Responsive**: Fully responsive across all devices
- **Fast Performance**: Built with Next.js for optimal performance
- **SEO Optimized**: Proper meta tags and structured data
- **Case Studies**: Detailed project showcases with client vs personal project distinction
- **Blog Section**: Professional thoughts and insights
- **Contact Integration**: Easy ways to get in touch

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Typography**: @tailwindcss/typography
- **Deployment**: Ready for Vercel/Netlify

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with spotlight effect
│   ├── case-studies/
│   │   └── [slug]/
│   │       └── page.tsx      # Dynamic case study pages
│   └── thoughts/
│       └── [slug]/
│           └── page.tsx      # Dynamic blog post pages
├── data/                     # Extracted content from original site
│   ├── case-studies.json     # All case study data
│   ├── blog-posts.json       # Blog post content
│   ├── navigation.json       # Site navigation
│   └── site-config.json      # Site metadata
└── components/               # Reusable components (future)
```

## 🎯 Content Sections

### Case Studies
- **Client Projects**: Professional work for clients
  - "How We Took Down an E-commerce Giant"
  - "Wetu Travel Platform Redesign"
  - "Network Provider App"
- **Personal Projects**: Creative and experimental work
  - "Do a Deali" (Multi-part case study)
  - "BlueShare"
  - "Itinerary App Design"

### Blog/Thoughts
- Business insights and professional development
- Design philosophy and methodology
- Education and learning perspectives
- Personal and professional growth

### About
- Professional background and experience
- Current role: Consulting Product Designer @MakeFriendly
- Contact information and social links

## 🎨 Design System

### Colors
- Primary: Blue gradient with spotlight effect
- Text: Gray scale for readability
- Accents: Blue for links, green for personal projects

### Typography
- Headings: Bold, clean hierarchy
- Body: Readable, optimized for web
- Code: Monospace for technical content

### Layout
- Grid-based responsive design
- Card-based content presentation
- Smooth hover effects and transitions

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Content Management

### Adding New Case Studies
1. Add data to `src/data/case-studies.json`
2. Add images to `public/images/case-studies/`
3. Update navigation if needed

### Adding New Blog Posts
1. Add data to `src/data/blog-posts.json`
2. Add images to `public/images/`
3. Update navigation if needed

### Updating Site Configuration
Edit `src/data/site-config.json` for:
- Site metadata
- Contact information
- Social links
- Professional details

## 🎯 SEO Features

- **Meta Tags**: Complete Open Graph and Twitter Card support
- **Structured Data**: JSON-LD for better search visibility
- **Sitemap**: Automatic generation (can be added)
- **Performance**: Optimized images and fast loading

## 🌟 Spotlight Effect

The site features a beautiful spotlight effect created with:
- Radial gradients for the spotlight
- Layered backgrounds for depth
- Smooth transitions and hover effects

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet**: Responsive grid layouts
- **Desktop**: Full-featured experience
- **Accessibility**: WCAG compliant design

## 🔧 Customization

### Colors
Edit `tailwind.config.ts` to customize:
- Primary colors
- Typography styles
- Component variants

### Content
- Update JSON files in `src/data/`
- Add new images to `public/images/`
- Modify page templates as needed

### Styling
- Customize Tailwind classes
- Add new components
- Modify layout structure

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Deploy automatically on push
3. Custom domain support

### Netlify
1. Build command: `npm run build`
2. Publish directory: `out`
3. Deploy from Git

### Other Platforms
- Any static hosting service
- CDN for global performance

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for user experience
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for Jared Buckley's personal portfolio. All rights reserved.

## 📞 Contact

- **Email**: jared@bucklemeshoe.com
- **LinkedIn**: [Jared Buckley](https://www.linkedin.com/in/jaredbuckley/)
- **Upwork**: Available for consulting projects

---

Built with ❤️ using Next.js, Tailwind CSS, and the spotlight template.

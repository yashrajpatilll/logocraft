# 🎨 LogoCraft

> **A 2-hour side project that became something useful** 

Professional multi-platform logo asset generator. Create perfect app icons and favicons for iOS, Android, and Web platforms instantly - all in your browser, completely free.

🚀 **[Try it live →](https://logocraft.yashrajpatil.com)**

## 📖 The Story

I was working on a React Native project and needed to generate various icon sizes for different platforms. During the process, I thought about building a simple tool to generate icons for different platforms. 

So I took a break from my usual technologies (Typescript, ReactJs, React Native, Nodejs, Redis, Docker and stuff) and went back to basics. Just HTML, CSS, and vanilla JavaScript, I built this tool in about 2 hours. Sometimes the simplest solutions are the most effective! 

It's funny how working with modern frameworks makes you appreciate the elegance of plain old web technologies.

## ✨ Features

- **🖱️ Drag & Drop Interface** - Just drop your logo and watch the magic happen
- **📱 Multi-Platform Support** - iOS, Android, Web, PWA, and Favicon formats
- **🎯 Pixel Perfect** - Generates all standard icon sizes with proper scaling
- **⚡ Lightning Fast** - Everything runs in your browser using Canvas API
- **🔒 Privacy First** - No uploads, no tracking, all processing happens locally
- **📱 Mobile Friendly** - Responsive design that works on all devices
- **📦 Batch Download** - ZIP all selected assets in one click
- **🎨 Smart Filtering** - Filter by platform to see only what you need

## 🛠️ Technical Details

Built with the fundamentals:

- **HTML5 Canvas API** for image processing and resizing
- **Vanilla JavaScript** for all functionality (no frameworks!)
- **CSS3** with custom properties and responsive design
- **JSZip** for creating downloadable archives
- **Static deployment** ready (works on any hosting platform)

### Supported Formats
- iOS App Icons (1024x1024, 512x512)
- Android Icons (432x432, 192x192, 512x512)
- Web Favicons (16x16, 32x32, 180x180, 512x512)
- ICO format support
- Universal splash screen icons

## 🚀 Quick Start

### Option 1: Use Online (Recommended)
Just visit [logocraft.yashrajpatil.com](https://logocraft.yashrajpatil.com) and start generating!

### Option 2: Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashrajpatilll/logocraft.git
   cd logocraft
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Or using Node.js
   npx serve .
   
   # Or just open index.html in your browser
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

That's it! No build process, no dependencies to install.

## 📋 How to Use

1. **Upload your logo** - Drag and drop or click to browse (PNG, JPG, SVG)
2. **Select platforms** - Choose from All, iOS, Android, Web, Favicons, or Universal
3. **Review generated assets** - Preview all generated icon sizes
4. **Download** - Select specific assets or download all as a ZIP

## 🏗️ Project Structure

```
logocraft/
├── index.html          # Main application
├── index.css           # Styling and responsive design
├── logocraft.js        # Core functionality
├── vercel.json         # Deployment configuration
├── package.json        # Project metadata
└── favicon/            # Sample favicon assets generated via LogoCraft
```

## 🤝 Contributing

Found a bug or have a feature idea? Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ Author

**Yashraj Patil**
- Website: [yashrajpatil.com](https://yashrajpatil.com)
- Twitter: [@yashrej](https://x.com/yashrej)
- GitHub: [@yashrajpatilll](https://github.com/yashrajpatilll)

---

*Made with ❤️ in 2 hours. Sometimes the best solutions are the simplest ones.*
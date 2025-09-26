# 🎬 YouTube Transcript Fetcher

A simple and efficient YouTube transcript fetcher that extracts captions and subtitles from YouTube videos in multiple formats (JSON, text, XML) with support for different languages.

[![npm version](https://badge.fury.io/js/yt-transcript-fetcher.svg)](https://www.npmjs.com/package/yt-transcript-fetcher)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Easy to use** - Simple API with minimal setup
- 🌍 **Multi-language support** - Fetch transcripts in different languages
- 📄 **Multiple output formats** - JSON, plain text, or XML
- 🌐 **Proxy support** - Use proxy servers to bypass restrictions

## 📦 Installation

```bash
# Using npm
npm install yt-transcript-fetcher

# Using yarn
yarn add yt-transcript-fetcher

# Using pnpm
pnpm add yt-transcript-fetcher
```

## 🚀 Quick Start

```typescript
import YoutubeTranscript from "yt-transcript-fetcher";

// Fetch transcript in JSON format (default)
const transcript = await YoutubeTranscript.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
console.log(transcript);
```

## 📚 Usage Examples

### Basic Usage

```typescript
import YoutubeTranscript from "yt-transcript-fetcher";

// Fetch transcript with default settings (English, JSON format)
const transcript = await YoutubeTranscript.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
```

### Different Output Formats

```typescript
const textTranscript = await YoutubeTranscript.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
  outputFormat: "text", //xml | json | text
});
```

### Different Languages

```typescript
const spanishTranscript = await YoutubeTranscript.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
  transcriptLanguage: "es",
});
```

## 🌐 Proxy Support

The library supports proxy configuration to bypass YouTube restrictions and regional blocks. Here are examples of different proxy configurations:

```typescript
const transcript = await YoutubeTranscript.fetch("https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
  proxy: {
    protocol: "https",
    host: "secure-proxy.example.com",
    port: 8080,
    auth: {
      username: "your-username",
      password: "your-password",
    },
  },
});
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Axios](https://axios-http.com/) for HTTP requests
- Inspired by the need for a simple YouTube transcript extraction tool

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the [Issues](https://github.com/syeddhasnainn/yt-transcript/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible, including:
   - YouTube URL you're trying to fetch
   - Error messages
   - Node.js version
   - Library version

---

Made with ❤️ by [Syed Hasnain](https://github.com/syeddhasnainn)

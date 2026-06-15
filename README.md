# YouTube Mini Player

A floating YouTube mini-player that sits in the bottom-right corner of the screen. Supports single videos and playlists with an interactive sidebar.

> **[Live Demo](https://ayushdocs.github.io/yt-miniplayer/)**

**Note:** This is a learning project — built to practice React, API integration, and state management. Not intended as a practical replacement for YouTube's own interface.

## Setup

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root with your YouTube Data API v3 key:

```
REACT_APP_API_KEY=your_api_key_here
```

Get a key from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

3. Start the dev server:

```bash
npm start
```

## Usage

Paste any YouTube URL into the input field:

- **Playlist URL** — loads the playlist with a scrollable sidebar of video titles
- **Video URL** — plays a single video
- **Raw ID** — accepts a playlist ID or video ID directly

Click a title in the sidebar to jump to that video. Click the × button to go back and load something else.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server |
| `npm run build` | Production build |
| `npm test` | Run tests |
| `npm run deploy` | Deploy to GitHub Pages |

## Tech Stack

- React 18
- YouTube Data API v3
- YouTube IFrame Player API
- Axios
- react-infinite-scroll-component

# YouTube Mini Player

A floating YouTube mini-player that sits in the bottom-right corner of the screen. Supports single videos and playlists with an interactive sidebar.

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

The app is pre-configured to load a Node.js tutorial playlist. To change the playlist or use a single video, edit the props in `src/index.js`:

- **Playlist mode:** `<App id="PLAYLIST_ID" isPlaylist height={500} width={700} />`
- **Single video mode:** `<App id="VIDEO_ID" height={500} width={700} />`

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

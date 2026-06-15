import axios from 'axios';
import {Fragment, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const extractId = (url) => {
	const trimmed = url.trim();
	if (!trimmed) return null;

	if (!trimmed.includes('youtube.com') && !trimmed.includes('youtu.be') && !trimmed.includes('://')) {
		if (trimmed.startsWith('PL') || trimmed.startsWith('UU') || trimmed.startsWith('OL') || trimmed.startsWith('RD')) {
			return {id: trimmed, isPlaylist: true};
		}
		return {id: trimmed, isPlaylist: false};
	}

	try {
		const urlObj = new URL(trimmed);
		const listParam = urlObj.searchParams.get('list');
		if (listParam) return {id: listParam, isPlaylist: true};
		const vParam = urlObj.searchParams.get('v');
		if (vParam) return {id: vParam, isPlaylist: false};
		if (urlObj.hostname === 'youtu.be') {
			const videoId = urlObj.pathname.slice(1).split('/')[0];
			if (videoId) return {id: videoId, isPlaylist: false};
		}
	} catch {
		return null;
	}

	return null;
};

const App = ({width, height}) => {
	const [entry, setEntry] = useState(null);
	const [urlInput, setUrlInput] = useState('');
	const [parseError, setParseError] = useState(null);
	const [offset, setOffset] = useState(0);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		setParseError(null);
		const result = extractId(urlInput);
		if (!result) {
			setParseError('Invalid YouTube URL or ID');
			return;
		}
		setOffset(0);
		setData(null);
		setError(null);
		setEntry(result);
	};

	useEffect(() => {
		if (!entry?.isPlaylist || !process.env.REACT_APP_API_KEY) return;
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${entry.id}&key=${process.env.REACT_APP_API_KEY}&maxResults=10`);
				setData(res.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [entry]);

	const getMoreData = async () => {
		if (!entry?.isPlaylist || !data?.nextPageToken) return;
		try {
			const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${entry.id}&key=${process.env.REACT_APP_API_KEY}&maxResults=10&pageToken=${data.nextPageToken}`);
			setData({...data, items: data.items.concat(res.data.items)});
		} catch (err) {
			setError(err.message);
		}
	};

	if (!entry) {
		return (
			<div className='landing'>
				<h1>YouTube Mini Player</h1>
				<form onSubmit={handleSubmit}>
					<input type='text' value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder='Paste a YouTube playlist or video URL...' />
					<button type='submit'>Load</button>
				</form>
				{parseError && <p className='msg error'>{parseError}</p>}
				{!process.env.REACT_APP_API_KEY && <p className='msg error'>Missing REACT_APP_API_KEY — create a .env file with your YouTube Data API key</p>}
				<p className='hint'>Supports playlist URLs, video URLs, or raw IDs</p>
			</div>
		);
	}

	if (!entry.isPlaylist) {
		return (
			<div id='player'>
				<button className='close-btn' onClick={() => setEntry(null)}>×</button>
				<iframe width={width} height={height} src={`https://www.youtube.com/embed/${entry.id}?rel=0&autoplay=1`} title='YouTube video player' frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
			</div>
		);
	}

	return (
		<div id='player'>
			<button className='close-btn' onClick={() => setEntry(null)}>×</button>
			<iframe width={width} height={height} src={`https://www.youtube.com/embed/videoseries?list=${entry.id}&index=${offset}&autoplay=1`} frameBorder='0' title='Youtube player' allow='autoplay' />
			{loading && !data ? (
				<div className='scroll-div' style={{width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<h4>Loading playlist...</h4>
				</div>
			) : error ? (
				<div className='scroll-div' style={{width: 300, color: 'red', padding: '1rem'}}>
					<h4>Error: {error}</h4>
				</div>
			) : (
				<InfiniteScroll className='scroll-div' hasMore={!!data?.nextPageToken} next={getMoreData} dataLength={data?.items?.length || 0} height={height} loader={<h4>Loading more...</h4>}>
					{data?.items?.map((item, index) => (
						<Fragment key={index}>
							<span className='playlist-title' onClick={() => setOffset(index + 1)}>
								{index + 1}. {item.snippet.title}
							</span>
							<hr />
						</Fragment>
					))}
				</InfiniteScroll>
			)}
		</div>
	);
};

export default App;

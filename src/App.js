import axios from 'axios';
import {Fragment, useEffect, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const App = ({id, isPlaylist, width, height}) => {
	const [offset, setOffset] = useState(0);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!process.env.REACT_APP_API_KEY || !isPlaylist) return;
		const fetchData = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${id}&key=${process.env.REACT_APP_API_KEY}&maxResults=10`);
				setData(res.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id, isPlaylist]);

	const getMoreData = async () => {
		if (!process.env.REACT_APP_API_KEY || !isPlaylist || !data?.nextPageToken) return;
		try {
			const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${id}&key=${process.env.REACT_APP_API_KEY}&maxResults=10&pageToken=${data.nextPageToken}`);
			setData({...data, items: data.items.concat(res.data.items)});
		} catch (err) {
			setError(err.message);
		}
	};

	if (!process.env.REACT_APP_API_KEY) {
		return (
			<div id='player'>
				<p>Missing REACT_APP_API_KEY. Create a .env file with your YouTube Data API key.</p>
			</div>
		);
	}

	if (!isPlaylist) {
		return (
			<div className='player'>
				<iframe
					width={width}
					height={height}
					src={`https://www.youtube.com/embed/${id}?rel=0`}
					title='YouTube video player'
					frameBorder='0'
					autoPlay={true}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen></iframe>
			</div>
		);
	}

	return (
		<div id='player'>
			<iframe width={width} height={height} src={`https://www.youtube.com/embed/videoseries?list=${id}&index=${offset}&autoplay=1`} frameBorder='0' title='Youtube player' allow='autoplay'></iframe>
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

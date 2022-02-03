/** @format */

import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const App = ({id, isPlaylist, width, height}) => {
	const [Offset, setOffset] = useState(0);
	const [Data, setData] = useState();
	const contentRef = useRef();
	useEffect(() => {
		(async () => {
			if (!process.env.REACT_APP_API_KEY || !isPlaylist) return;
			const res = await axios.get(` https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${id}&key=${process.env.REACT_APP_API_KEY}&maxResults=020`);
			setData(res.data);
		})();
	}, [id, isPlaylist]);
	const getMoreData = async () => {
		if (!process.env.REACT_APP_API_KEY || !isPlaylist) return;
		const res = await axios.get(` https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&playlistId=${id}&key=${process.env.REACT_APP_API_KEY}&maxResults=10&pageToken=${Data.nextPageToken}`);
		setData({...Data, items: Data.items.concat(res.data.items)});
	};
	return (
		<div className='player'>
			{isPlaylist ? (
				<div id='player'>
					<iframe width={width} height={height} src={`https://www.youtube.com/embed?listType=playlist&list=${id}&rel=0&autoplay=1&index=${Offset}`} frameBorder='0' title='Youtube player'></iframe>
					{/* <ul className='list' style={{overflow: 'auto'}}> */}
						<InfiniteScroll className='scroll-div' hasMore={true} next={getMoreData} dataLength={Data?.items?.length || 0} height={height} loader={<h4>Loading...</h4>}>
							{Data?.items?.map?.((item, index) => (
								<>
									<span onClick={() => setOffset(index + 1)} key={index}>
										{index+1}- {item.snippet.title.substring(0, 10)}
									</span>
									<hr />
								</>
							))}
						</InfiniteScroll>
					{/* </ul> */}
				</div>
			) : (
				<iframe
					width={width}
					height={height}
					src={`https://www.youtube.com/embed/${id}?rel=0`}
					title='YouTube video player'
					frameBorder='0'
					autoPlay={true}
					allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
					allowFullScreen></iframe>
			)}
		</div>
	);
};

export default App;

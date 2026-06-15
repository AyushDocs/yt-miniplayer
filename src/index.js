import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<App height={500} width={700} />
	</React.StrictMode>
);

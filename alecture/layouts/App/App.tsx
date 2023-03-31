import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';
import Channel from '@pages/Channel/Channel';
import DirectMessage from '@pages/DirectMessage/DirectMessage';

const SignUp = loadable(() => import('@pages/SignUp/SignUp'), {
	fallback: <h1>Loading SignUp</h1>,
});
const Login = loadable(() => import('@pages/Login/Login'));
const Workspace = loadable(() => import('@layouts/Workspace/Workspace'));

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				{/*<Route path="/channel/:email" element={<Channel />} />*/}
				<Route path="/workspace/:workspace/*" element={<Workspace />}>
					<Route path="channel/:channel" element={<Channel />} />
					<Route path="dm/:id" element={<DirectMessage />} />
				</Route>
				{/*<Route path="/workspace/channel" element={<Channel />} />
				<Route path="/workspace/dm" element={<DirectMessage />} />*/}
			</Routes>
		</BrowserRouter>
	);
};

export default App;

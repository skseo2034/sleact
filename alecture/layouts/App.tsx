import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';
import Channel from '@pages/Channel/Channel';

const SignUp = loadable(() => import('@pages/SignUp/SignUp'));
const Login = loadable(() => import('@pages/Login/Login'));

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				{/*<Route path="/channel/:email" element={<Channel />} />*/}
				<Route path="/channel" element={<Channel />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;

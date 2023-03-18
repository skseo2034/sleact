import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

const SignUp = loadable(() => import('../pages/SignUp/SignUp'), {
	fallback: <h1>Loading SignUp</h1>,
});
const Login = loadable(() => import('../pages/Login/Login'));
const Channel = loadable(() => import('../pages/Channel/Channel'));

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Navigate replace to="/login" />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				{/*<Route path="/channel/:email" element={<Channel />} />*/}
				<Route path="/workspace/channel" element={<Channel />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;

import React from 'react';
import { useLocation } from 'react-router';
import Workspace from '@layouts/Workspace';

/*
type channelType = {
	email: string;
};
*/

// const Channel = ({ email }: channelType) => {
//const Channel = () => {
const Channel = () => {
	const location = useLocation();
	console.log('channel >>>>> ', location);
	return (
		<Workspace>
			<div>로그인 하신것을 축하드립니다. 채널 페이지 입니다.</div>
		</Workspace>
	);
	//const { email } = useLocation();
};

export default Channel;

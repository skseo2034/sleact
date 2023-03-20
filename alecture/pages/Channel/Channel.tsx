import React from 'react';
import { useLocation } from 'react-router';

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
		<div>채널 페이지 입니다.</div>
	);
	//const { email } = useLocation();
};

export default Channel;

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
	//const { email } = useLocation();
	return <div>채널 페이지</div>;
};

export default Channel;

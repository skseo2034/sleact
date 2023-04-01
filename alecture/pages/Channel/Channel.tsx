import React, { useCallback } from 'react';
import { useLocation } from 'react-router';
import { Container } from '@pages/DirectMessage/directMessageStyle';
import ChatList from '@components/ChatList/ChatList';
import ChatBox from '@components/ChatBox/ChatBox';
import useInput from '@hooks/useInput';

/*
type channelType = {
	email: string;
};
*/

// const Channel = ({ email }: channelType) => {
//const Channel = () => {
const Channel = () => {
	const location = useLocation();
	const [chat, onChangeChat, setChat] = useInput('');
	const onSubmitFormChannel = useCallback((e: any) => {
		console.log('channel submit');
		e.preventDefault();
		setChat('');
	}, []);

	console.log('channel >>>>> ', location);
	return (
		<Container>
			<ChatList />
			<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitFormChannel} />
		</Container>
	);
	//const { email } = useLocation();
};

export default Channel;

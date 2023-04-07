import React, { useCallback, useRef } from 'react';
import { useLocation } from 'react-router';
import { Container } from '@pages/DirectMessage/directMessageStyle';
import ChatList from '@components/ChatList/ChatList';
import ChatBox from '@components/ChatBox/ChatBox';
import useInput from '@hooks/useInput';
import Scrollbars from 'react-custom-scrollbars-2';
import makeSection from '@utils/makeSection';

/*
type channelType = {
	email: string;
};
*/

// const Channel = ({ email }: channelType) => {
//const Channel = () => {
const Channel = () => {
	const scrollbarRef = useRef<Scrollbars>(null);
	const location = useLocation();
	const [chat, onChangeChat, setChat] = useInput('');
	const onSubmitFormChannel = useCallback((e: any) => {
		console.log('channel submit');
		e.preventDefault();
		setChat('');
	}, []);

	console.log('channel >>>>> ', location);
	const chatSections = makeSection([]);
	return (
		<Container>
			<ChatList
				scrollbarRef={scrollbarRef}
				/*setSize={setSize}*/
				isEmpty={false}
				isReachingEnd={false}
				chatSections={chatSections}
			/>
			<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitFormChannel} />
		</Container>
	);
	//const { email } = useLocation();
};

export default Channel;

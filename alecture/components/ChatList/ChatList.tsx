import React, { useRef } from 'react';
import { ChatZone, Section } from '@components/ChatList/chatListStyles';
import Scrollbars from 'react-custom-scrollbars-2';
import Chat from '@components/Chat/Chat';
import dayjs from 'dayjs';

const ChatList = () => {
	const scrollbarRef = useRef(null);
	const onscroll = () => {
		//.....
	};
	return (
		<ChatZone>
			<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onscroll}>
				<Section>
					section&nbsp;&nbsp;
					<span>{dayjs('20230131235959').format('h:mm A')}</span>
				</Section>
				<Section>
					section&nbsp;&nbsp;
					<span>{dayjs('20230131235959').format('YYYY-MM-DDTHH:mm:ssZ')}</span>
				</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
				<Section>section</Section>
			</Scrollbars>
		</ChatZone>
	);
};

export default ChatList;

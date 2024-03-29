import React, { useMemo, useRef, forwardRef, FC, RefObject } from 'react';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/chatListStyles';
import Scrollbars from 'react-custom-scrollbars-2';
import Chat from '@components/Chat/Chat';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import { IChat, IDM } from '@typings/db';

interface Props {
	scrollbarRef: RefObject<Scrollbars>;
	isReachingEnd?: boolean;
	isEmpty: boolean;
	chatSections: { [key: string]: (IDM | IChat)[] };
	/*setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;*/
}
const ChatList: FC<Props> = ({ scrollbarRef, /*setSize,*/ isReachingEnd, isEmpty, chatSections }) => {
	const onScroll = (values: any) => {
		if (values.scrollTop === 0 && !isReachingEnd) {
			console.log('가장 위');
			/*setSize(prevSize => prevSize + 1).then(() => {
				// 스크롤위치 유지
			});*/
		}
	};

	const data = {
		contents: '@[수고1](7) 뭐하니요1~ ㅎㅎ1',
	};

	// \d 숫자  +는 1개이상 ?는 0개이상  g는 모두 찾기
	// @[333]12](7) 이를때 + 최대한 많이 찾는다. => 333]12
	// +? 는 최대한 조금 찾는다 => 333
	// | 또는 을 의미
	// \n 은 줄바꿈 의미

	// 참고로 아래는 모든 줄바꿈문자를 br로 변경하는 것이다.
	const result1 = regexifyString({
		input: data.contents,
		pattern: /\n/g,
		decorator(match, index) {
			return <br key={index} />;
		},
	});
	const workspace = 'Sleact';
	// (.+?) 와 (\d+?) 이렇게 소괄호로 감싸면 arr 로잡힌다.
	const result = useMemo(
		() =>
			regexifyString({
				input: data.contents,
				pattern: /@\[(.+?)\]\((\d+?)\)|\n]/g,
				decorator(match, index) {
					// const arr = match.match(/@\[.+?\]\(\d+?\)/)!;
					const arr = match.match(/@\[(.+?)\]\((\d+?)\)/)!;
					console.log('arr', arr);
					if (arr) {
						return (
							<Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
								@{arr[1]}
							</Link>
						);
					}
					return <br key={index} />;
				},
			}),
		[data.contents]
	);

	return (
		<ChatZone>
			<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
				<Section>
					section&nbsp;&nbsp;
					<span>{dayjs('20230131235959').format('h:mm A')}</span>
				</Section>
				<Section>
					section&nbsp;&nbsp;
					<span>{dayjs('20230131235959').format('YYYY-MM-DDTHH:mm:ssZ')}</span>
				</Section>
				<Section>
					section&nbsp;&nbsp;
					<br />
					{result}
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
			</Scrollbars>
		</ChatZone>
		/*<ChatZone>
			<Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
				{Object.entries(chatSections).map(([date, chats]) => {
					return (
						<Section className={`section-${date}`} key={date}>
							<StickyHeader>
								<button>{date}</button>
							</StickyHeader>
							{chats.map(chat => (
								<Chat key={chat.id} data={chat} />
							))}
						</Section>
					);
				})}
			</Scrollbars>
		</ChatZone>*/
	);
};

export default ChatList;

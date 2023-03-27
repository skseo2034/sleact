import React from 'react';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/DirectMessage/directMessageStyle';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox/ChatBox';
import ChatList from '@components/ChatList/ChatList';

const DirectMessage = () => {
	const { workspace, id } = useParams();
	const theOtherPartyInfoUrl = `/api/workspaces/${workspace}/users/${id}`;
	const myInfoUrl = '/api/users';
	const {
		data: theOtherPartyUserData,
		error,
		mutate,
	} = useSWR<IUser>(theOtherPartyInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});

	const {
		data: myData,
		error: myError,
		mutate: myMutate,
	} = useSWR<IUser>(myInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});

	console.log('theOtherPartyUserData={}, myData={}', theOtherPartyUserData, myData);
	if (!theOtherPartyUserData || !myData) {
		return null;
	}

	return (
		<Container>
			<Header>
				<img
					src={gravatar.url(theOtherPartyUserData.email, { s: '24px', d: 'retro' })}
					alt={theOtherPartyUserData.nickname}
				/>
				<span>{theOtherPartyUserData.nickname}</span>
			</Header>
			<ChatList />
			<ChatBox chat="" />
		</Container>
	);
};

export default DirectMessage;

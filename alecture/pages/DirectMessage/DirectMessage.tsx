import React, { useCallback } from 'react';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/DirectMessage/directMessageStyle';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox/ChatBox';
import ChatList from '@components/ChatList/ChatList';
import useInput from '@hooks/useInput';
import { useQuery } from 'react-query';

const DirectMessage = () => {
	const { workspace, id } = useParams();
	const theOtherPartyInfoUrl = `/api/workspaces/${workspace}/users/${id}`;
	const myInfoUrl = '/api/users';
	/*const {
		data: theOtherPartyUserData,
		error,
		mutate,
	} = useSWR<IUser>(theOtherPartyInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});*/

	const {
		isLoading,
		isError,
		data: theOtherPartyUserData,
		error,
	} = useQuery(['loginUserInfo', theOtherPartyInfoUrl], () => fetcher(theOtherPartyInfoUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		onSuccess: data => {
			// 성공시 호출
			console.log('loginUserInfo', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log(e.message);
		},
	});

	if (isLoading) {
		console.log('LOADING');
		//return "Loading...";
	}

	if (isError) {
		console.log('error', error.message);
		//return "An error has occurred: " + error;
	}

	/*const {
		data: myData,
		error: myError,
		mutate: myMutate,
	} = useSWR<IUser>(myInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});*/

	const {
		isLoading: isMyDataLoading,
		isError: isMydataError,
		data: myData,
		error: myDataError,
	} = useQuery(['loginUserInfo', myInfoUrl], () => fetcher(myInfoUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		onSuccess: data => {
			// 성공시 호출
			console.log('loginUserInfo', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log(e.message);
		},
	});

	if (isMyDataLoading) {
		console.log('LOADING');
		//return "Loading...";
	}

	if (isMydataError) {
		console.log('error', error.message);
		//return "An error has occurred: " + error;
	}

	const [chat, onChangeChat] = useInput('');
	const onSubmitForm = useCallback((e: any) => {
		console.log('DirectMessage onSubmitForm');
		e.preventDefault();
	}, []);

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
			<ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
		</Container>
	);
};

export default DirectMessage;

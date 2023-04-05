import React, { useCallback, useRef } from 'react';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import { IDM, IUser } from '@typings/db';
import { fetcher, Swrfetcher } from '@utils/fetcher';
import gravatar from 'gravatar';
import { Container, Header } from '@pages/DirectMessage/directMessageStyle';
import { useParams } from 'react-router';
import ChatBox from '@components/ChatBox/ChatBox';
import ChatList from '@components/ChatList/ChatList';
import useInput from '@hooks/useInput';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import Scrollbars from 'react-custom-scrollbars-2';
import makeSection from '@utils/makeSection';

const PAGE_SIZE = 20;
const DirectMessage = () => {
	const { workspace, id } = useParams();
	const queryClient = useQueryClient();
	const [chat, onChangeChat, setChat] = useInput('');
	const theOtherPartyInfoUrl = `/api/workspaces/${workspace}/users/${id}`;
	const myInfoUrl = '/api/users';
	const scrollbarRef = useRef<Scrollbars>(null);
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
	} = useQuery('theOtherPartyInfo', () => fetcher({ fetchUrl: theOtherPartyInfoUrl }), {
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
	} = useQuery('loginUserInfo', () => fetcher({ fetchUrl: myInfoUrl }), {
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

	/*const {
		data: chatData,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<IDM[]>(
		['workspace', workspace, 'dm', id, 'chat'],
		({ pageParam }) =>
			fetcher({ fetchUrl: `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${pageParam + 1}` }),
		{
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length === 0) return;
				return pages.length;
			},
		}
	);*/

	const chatUrl = `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`;

	/*const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(chatUrl, Swrfetcher);
	console.log('DirectMessage', chatData);*/

	/*const { data: chatData } = useQuery('pageChatData', () => fetcher({ fetchUrl: chatUrl }), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		onSuccess: data => {
			// 성공시 호출
			console.log('pageChatData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log(e.message);
		},
	});*/

	/*const mutation = useMutation<IUser, AxiosError, { content: string }>(
		'loginUserInfo',
		data =>
			axios
				.post(`/api/workspaces/$workspace}/dms/${id}/chats`, data, { withCredentials: true })
				.then(res => res.data),
		{
			onMutate() {
				setChat('');
			},
			async onSuccess(data) {
				await queryClient.refetchQueries(['pageChatData']);
			},
			onError(error) {
				console.log('Failed', error.message);
			},
			onSettled() {
				console.log('Login Mutation completed.');
			},
		}
	);*/
	const {
		data: chatData,
		mutate: mutateChat,
		/*setSize,*/
	} = useSWRInfinite<IDM[]>(
		(index: number) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PAGE_SIZE}&page=${index + 1}`,
		fetcher,
		{
			onSuccess(data) {
				if (data?.length === 1) {
					setTimeout(() => {
						scrollbarRef.current?.scrollToBottom();
					}, 100);
				}
			},
		}
	);
	//
	const isEmpty = chatData?.[0]?.length === 0;
	const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PAGE_SIZE);

	const onSubmitFormDirectMessage = useCallback(
		(e: any) => {
			e.preventDefault();
			console.log('DirectMessage onSubmitForm', chat);
			if (chat?.trim()) {
				/*fetch(`/api/workspaces/${workspace}/dms/${id}/chats`, {
					method: 'POST', // *GET, POST, PUT, DELETE, etc.
					body: JSON.stringify({ content: chat }),
				})
					.then(res => res.json)
					.then(res => console.log(res));*/
				/*axios
					.post(
						`/api/workspaces/${workspace}/dms/${id}/chats`,
						{ content: chat },
						{
							withCredentials: true,
						}
					)
					.then(async res => {
						console.log('DirectMessage post', res.data);
						await mutateChat();
						setChat('');
					})
					.catch(console.error);*/
				queryClient.refetchQueries('pageChatData');
			}
		},
		[chat]
	);

	console.log('theOtherPartyUserData={}, myData={}', theOtherPartyUserData, myData);
	if (!theOtherPartyUserData || !myData) {
		return null;
	}

	const chatSections = makeSection(chatData ? chatData.flat().reverse() : []);

	return (
		<Container>
			<Header>
				<img
					src={gravatar.url(theOtherPartyUserData.email, { s: '24px', d: 'retro' })}
					alt={theOtherPartyUserData.nickname}
				/>
				<span>{theOtherPartyUserData.nickname}</span>
			</Header>
			<ChatList
				scrollbarRef={scrollbarRef}
				/*setSize={setSize}*/
				isEmpty={isEmpty}
				isReachingEnd={isReachingEnd}
				chatSections={chatSections}
			/>
			<ChatBox chat={chat} onSubmitForm={onSubmitFormDirectMessage} onChangeChat={onChangeChat} />
		</Container>
	);
};

export default DirectMessage;

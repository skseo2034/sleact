import React, { FC, useCallback, useEffect, useState } from 'react';
import { IChannel, IChat, IUser } from '@typings/db';
import { useLocation, useParams } from 'react-router';
import { CollapseButton } from '@components/DMList/DMListStyles';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '@utils/fetcher';
import { useQuery } from 'react-query';

/*
interface Props {
	channelData?: IChannel[];
	userData?: IUser | boolean | undefined;
}
*/

const reqUserInfoUrl = '/api/users';

const ChannelList: FC = () => {
	/*const {
		data: userData,
		error,
		mutate,
	} = useSWR<IUser>(reqUserInfoUrl, fetcher, {
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});*/

	const {
		isLoading,
		isError,
		data: userData,
		error,
	} = useQuery(['loginUserInfo', reqUserInfoUrl], () => fetcher(reqUserInfoUrl), {
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

	const { workspace } = useParams<{ workspace?: string }>();

	/*const { data: channelData } = useSWR<IChannel[]>(
		userData ? `/api/workspaces/${workspace}/channels` : null,
		fetcher
	);*/

	const getChannelUrl = `/api/workspaces/${workspace}/channels`;
	const { data: channelData } = useQuery<IChannel[]>(['channelData', getChannelUrl], () => fetcher(getChannelUrl), {
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

	const location = useLocation();
	// const [socket] = useSocket(workspace);
	const [channelCollapse, setChannelCollapse] = useState(false);
	const [countList, setCountList] = useState<{ [key: string]: number | undefined }>({});

	const toggleChannelCollapse = useCallback(() => {
		setChannelCollapse(prev => !prev);
	}, []);

	const resetCount = useCallback(
		(id: any) => () => {
			setCountList(list => {
				return {
					...list,
					[id]: undefined,
				};
			});
		},
		[]
	);

	useEffect(() => {
		console.log('ChannelList: workspace 바꼈다', workspace, location.pathname);
		setCountList({});
	}, [workspace, location]);

	const onMessage = (data: IChat) => {
		console.log('message 왔다', data);
		const mentions: string[] | null = data.content.match(/@\[(.+?)]\((\d)\)/g);
		if (mentions?.find(v => v.match(/@\[(.+?)]\((\d)\)/)![2] === userData?.id.toString())) {
			return setCountList(list => {
				return {
					...list,
					[`c-${data.ChannelId}`]: (list[`c-${data.ChannelId}`] || 0) + 1,
				};
			});
		}
		setCountList(list => {
			return {
				...list,
				[`c-${data.ChannelId}`]: list[`c-${data.ChannelId}`] || 0,
			};
		});
	};

	/*useEffect(() => {
		socket?.on('message', onMessage);
		console.log('socket on message', socket?.hasListeners('message'));
		return () => {
			socket?.off('message', onMessage);
			console.log('socket off message', socket?.hasListeners('message'));
		};
	}, [socket]);
*/
	return (
		<>
			<h2>
				<CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
					{' '}
					펼침
					<i
						className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
						data-qa="channel-section-collapse"
						aria-hidden="true"
					/>
				</CollapseButton>
				<span>Channels</span>
			</h2>
			<div>
				{!channelCollapse &&
					channelData?.map(channel => {
						const count = countList[`c-${channel.id}`];
						return (
							<NavLink
								key={channel.name}
								className={({ isActive }) => (isActive ? 'selected' : '')}
								to={`/workspace/${workspace}/channel/${channel.name}`}
								onClick={resetCount(`c-${channel.id}`)}
							>
								<span className={count !== undefined && count >= 0 ? 'bold' : undefined}>
									# {channel.name}
								</span>
								{count !== undefined && count > 0 && <span className="count">{count}</span>}
							</NavLink>
						);
					})}
			</div>
		</>
	);
};

export default ChannelList;

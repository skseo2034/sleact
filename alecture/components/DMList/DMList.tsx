import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CollapseButton } from './DMListStyles';
import { NavLink } from 'react-router-dom';
import { IUser, IUserWithOnline } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import useSWR from 'swr';
import { useQuery } from 'react-query';

const reqUserInfoUrl = '/api/users';

const DMList = () => {
	const [channelCollapse, setChannelCollapse] = useState(false);
	const { workspace } = useParams<{ workspace: string }>();

	/*const { data: userData } = useSWR<IUser>(reqUserInfoUrl, fetcher);*/

	const { data: userData } = useQuery(['loginUserInfo', reqUserInfoUrl], () => fetcher(reqUserInfoUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		onSuccess: data => {
			// 성공시 호출
			console.log('userData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log(e.message);
		},
	});

	/*const { data: memberData } = useSWR<IUserWithOnline[]>(
		userData ? `/api/workspaces/${workspace}/members` : null,
		fetcher
	);*/

	const reqMemberDataUrl = `/api/workspaces/${workspace}/members`;
	const { data: workspacesMemberData } = useQuery<IUserWithOnline[]>(
		['memberData', reqMemberDataUrl],
		() => fetcher(reqMemberDataUrl),
		{
			refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
			retry: 0, // 실패시 재호출 몇번 할지
			enabled: !!userData, // true 이면 실행, 즉, loginUserInfoData가 있으면 실행
			onSuccess: data => {
				// 성공시 호출
				console.log('loginUserInfo', data);
			},
			onError: (e: any) => {
				// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
				// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
				console.log(e.message);
			},
		}
	);

	/*const { data: memberData } = useSWR<IUserWithOnline[]>(
		userData ? `/api/workspace/${workspace}/members` : null,
		fetcher
	);*/

	const toggleChannelCollapse = useCallback(() => {
		setChannelCollapse(prev => !prev);
	}, []);
	// const [socket, disconnect] = useSocket(workspace);
	const [onlineList, setOnlineList] = useState<number[]>([]);

	/*useEffect(() => {
		socket?.on('onlineList', (data: number[]) => {
			setOnlineList(data);
		});
	}, [socket]);*/

	return (
		<div>
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
				<span>Direct Message</span>
			</h2>
			<div>
				{!channelCollapse &&
					workspacesMemberData?.map((member: IUserWithOnline) => {
						const isOnline = onlineList.includes(member.id);
						return (
							<NavLink
								key={member.id}
								className={({ isActive }) => (isActive ? 'selected' : '')}
								to={`/workspace/${workspace}/dm/${member.id}`}
							>
								<i
									className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
										isOnline
											? 'c-presence--active c-icon--presence-online'
											: 'c-icon--presence-offline'
									}`}
									aria-hidden="true"
									data-qa="presence_indicator"
									data-qa-presence-self="false"
									data-qa-presence-active="false"
									data-qa-presence-dnd="false"
								/>
								<span>{member.nickname}</span>
								{member.id === userData?.id && <span> (나)</span>}
							</NavLink>
						);
					})}
			</div>
		</div>
	);
};

export default DMList;

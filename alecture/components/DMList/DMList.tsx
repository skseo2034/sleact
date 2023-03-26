import React, { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CollapseButton } from './DMListStyles';
import { NavLink } from 'react-router-dom';
import { IUser, IUserWithOnline } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import useSWR from 'swr';

const reqUserInfoUrl = '/api/users';

const DMList = () => {
	const [channelCollapse, setChannelCollapse] = useState(false);
	const { workspace } = useParams<{ workspace: string }>();

	const { data: userData } = useSWR<IUser>(reqUserInfoUrl, fetcher);
	const { data: memberData } = useSWR<IUserWithOnline[]>(
		userData ? `/api/workspaces/${workspace}/members` : null,
		fetcher
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
					memberData?.map((member: IUserWithOnline) => {
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

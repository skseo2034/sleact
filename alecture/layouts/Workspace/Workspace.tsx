import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import {fetcher} from "@utils/fetcher";
import {
	Channels,
	Chats,
	Header, MenuScroll,
	ProfileImg,
	RightMenu, WorkspaceName,
	Workspaces,
	WorkspaceWrapper
} from "@layouts/Workspace/workspaceStyle";
import gravatar from 'gravatar';
import loadable from "@loadable/component";
const Channel = loadable(() => import('@pages/Channel/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage/DirectMessage'));

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';
	const reqLogoutUrl = `${API_URL}:${PORT}/api/users/logout`;

	const { data, error, mutate } = useSWR(reqUserInfoUrl, fetcher, {
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});
	// const { data, isLoading, error } = fetcher1(reqUserInfoUrl);

	const { data: localType } = useSWR('localType');
	console.log('localType', localType);

	const onLogout = useCallback(() => {
		axios
			.post(reqLogoutUrl, null, {
				withCredentials: true, // 쿠키를 항상 공유하기 위해서 true 로 함.
			})
			.then(async res => {
				console.log('Workspace res >>>>> ', res);
				//await mutate(res.data, true);
				await mutate(false, false); // false 서버에 요청 보내지 않고 로컬데이터를 수정. 보내할 사항이면 true 사용해야 함.
				navigate('/login');
			})
			.catch(error => {
				console.log('에러발생 >>>> ', error.response);
			});
	}, []);

	console.log('Workspace data1 >>>>> ', data);

//	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		//if (data == 'ok' || !data) {
		//	console.log('login 으로 이동', data == 'ok');
		//	navigate('/login');
		//}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
	//}, [data]);

	return (
		<div>
			<Header>
				<RightMenu>
					<span>
						<ProfileImg src={gravatar.url(data?.nickname, {s: '28px', d: 'retro'})} alt={data?.email}></ProfileImg>
					</span>
				</RightMenu>
			</Header>
			<button onClick={onLogout}>로그아웃</button>
			<WorkspaceWrapper>
				<Workspaces>Workspaces<br/>test</Workspaces>
				<Channels>
					<WorkspaceName>WorkspaceName Sleact</WorkspaceName>
					<MenuScroll>menu scroll</MenuScroll>
				</Channels>
				<Chats>
					<Routes>
						<Route path="channel" element={<Channel />} />
						<Route path="dm" element={<DirectMessage />} />
					</Routes>
				</Chats>
			</WorkspaceWrapper>
		</div>
	);
};

export default Workspace;

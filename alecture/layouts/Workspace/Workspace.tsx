import React, { FC, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { fetcher } from '@utils/fetcher';
import {
	AddButton,
	Channels,
	Chats,
	Header,
	LogOutButton,
	MenuScroll,
	ProfileImg,
	ProfileModal,
	RightMenu,
	WorkspaceButton,
	WorkspaceName,
	Workspaces,
	WorkspaceWrapper,
} from '@layouts/Workspace/workspaceStyle';
import { Button, Input, Label } from '@pages/SignUp/signUpStyle';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu/Menu';
import { IUser, IWorkspace } from '@typings/db';
import Modal from '@components/Modal/Modal';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
const Channel = loadable(() => import('@pages/Channel/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage/DirectMessage'));

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
	const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
	const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';
	const reqLogoutUrl = `${API_URL}:${PORT}/api/users/logout`;

	const { data, error, mutate } = useSWR<IUser | boolean>(reqUserInfoUrl, fetcher, {
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

	const onClickUserProfile = useCallback(() => {
		console.log('click');
		setShowUserMenu(true);
	}, []);

	const onCloseUserProfile = useCallback((e: any) => {
		e.stopPropagation();
		console.log('close');
		setShowUserMenu(false);
	}, []);

	const onClickCreateWorkspace = useCallback(() => {
		setShowCreateWorkspaceModal(true);
	}, []);

	const onCreateWorkspace = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault(); // form submit 할때 새로고침 안되게 함.
			if (!newWorkspace || !newWorkspace.trim()) {
				return;
			}
			if (!newUrl || !newUrl.trim()) {
				return;
			}

			axios
				.post(
					'/api/workspaces',
					{
						workspace: newWorkspace,
						url: newUrl,
					},
					{
						withCredentials: true,
					}
				)
				.then(async () => {
					await mutate();
					setShowCreateWorkspaceModal(false);
					setNewWorkspace('');
					setNewUrl('');
					//	toast.success('생성완료', { position: 'bottom-center' });
					alert('생성완료');
					toast.error('생성완료', { position: 'bottom-center' });
				})
				.catch(error => {
					console.dir(error);
					toast.error(error.response?.data, { position: 'bottom-center' });
				});
		},
		[newWorkspace, newUrl]
	);

	const onCloseModal = useCallback(() => {
		setShowCreateWorkspaceModal(false);
	}, []);

	return (
		<div>
			<Header>
				<RightMenu>
					<span onClick={onClickUserProfile}>
						<ProfileImg
							src={gravatar.url((data as IUser)?.nickname, { s: '28px', d: 'retro' })}
							alt={(data as IUser)?.email}
						></ProfileImg>
						{showUserMenu && (
							<Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
								<ProfileModal>
									<img
										src={gravatar.url((data as IUser)?.nickname, { s: '36px', d: 'retro' })}
										alt={(data as IUser)?.email}
									/>
									<div>
										<span id="profile-name">{(data as IUser)?.nickname}</span>
										<span id="profile-active">Active</span>
									</div>
								</ProfileModal>
								<LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
							</Menu>
						)}
					</span>
				</RightMenu>
			</Header>
			<WorkspaceWrapper>
				<Workspaces>
					{(data as IUser)?.Workspaces?.map(ws => {
						return (
							<Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
								<WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
							</Link>
						);
					})}
					<AddButton onClick={onClickCreateWorkspace}>+</AddButton>
				</Workspaces>
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
			<Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
				<form onSubmit={onCreateWorkspace}>
					<Label id="workspace-label">
						<span>워크스페이스 이름</span>
						<Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
					</Label>
					<Label id="workspace-url-label">
						<span>워크스페이스 url</span>
						<Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
					</Label>
					<Button type="submit">생성하기</Button>
				</form>
			</Modal>
		</div>
	);
};

export default Workspace;

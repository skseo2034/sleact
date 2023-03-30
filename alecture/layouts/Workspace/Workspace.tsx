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
	WorkspaceModal,
	WorkspaceName,
	Workspaces,
	WorkspaceWrapper,
} from '@layouts/Workspace/workspaceStyle';
import { Button, Input, Label } from '@pages/SignUp/signUpStyle';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu/Menu';
import { IChannel, IUser, IWorkspace } from '@typings/db';
import Modal from '@components/Modal/Modal';
import useInput from '@hooks/useInput';
import { toast } from 'react-toastify';
import CreateChannelModal from '@components/CreateChannelModal/CreateChannelModal';
import { useParams } from 'react-router';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal/InviteWorkspaceModal';
import InviteChannelModal from '@components/InviteWorkspaceModal/InviteWorkspaceModal';
import InviteChannelModalModal from '@components/InviteChannelModal/InviteChannelModal';
import ChannelList from '@components/ChannelList/ChannelList';
import DMList from '@components/DMList/DMList';
import { useMutation, useQuery } from 'react-query';
const Channel = loadable(() => import('@pages/Channel/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage/DirectMessage'));

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = () => {
	const [showUserMenu, setShowUserMenu] = useState(false);
	const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
	const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
	const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
	const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
	const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
	const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
	const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

	const { workspace } = useParams<string>();
	// console.log('workspace', workspace);
	const navigate = useNavigate();
	// const API_URL = process.env.REACT_APP_API_URL;
	// const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';
	const reqLogoutUrl = '/api/users/logout';

	/*const {
		data: userData,
		error,
		mutate,
	} = useSWR<IUser | boolean>(reqUserInfoUrl, fetcher, {
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});*/

	const {
		isLoading,
		isError,
		data: loginUserInfoData,
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

	console.log('data', loginUserInfoData);
	/*const { data: channelData } = useSWR<IChannel[]>(
		loginUserInfoData ? `/api/workspaces/${workspace}/channels` : null,
		fetcher
	);*/
	const getChannelsUrl = `/api/workspaces/${workspace}/channels`;
	const { data: channelData } = useQuery(['channelData', getChannelsUrl], () => fetcher(getChannelsUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		enabled: loginUserInfoData,
		onSuccess: data => {
			// 성공시 호출
			console.log('workspaces channelData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log('workspace getChannels Error', e.message);
		},
	});

	//console.log('channelData', channelData);

	/*const { data: memberData } = useSWR<IUser[]>(
		loginUserInfoData ? `/api/workspaces/${workspace}/members` : null,
		fetcher
	);*/
	const reqMemberDataUrl = `/api/workspaces/${workspace}/members`;
	const {
		isLoading: isMemberDataLoading,
		isError: isMemberDataError,
		data: memberData,
		error: memberDataError,
	} = useQuery(['workspaceMemberData', reqMemberDataUrl], () => fetcher(reqMemberDataUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		enabled: !!loginUserInfoData, // true 이면 실행, 즉, loginUserInfoData가 있으면 실행
		onSuccess: data => {
			// 성공시 호출
			console.log('workspace MemberData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log('workspace getMembers Error', e.message);
		},
	});

	if (isMemberDataLoading) {
		console.log('LOADING');
		//return "Loading...";
	}

	if (isMemberDataError) {
		console.log('error', error.message);
		//return "An error has occurred: " + error;
	}

	console.log('memberData', memberData);

	// const { data, isLoading, error } = fetcher1(reqUserInfoUrl);
	const { data: localType } = useSWR('localType');
	console.log('localType', localType);

	const logoutMutation = useMutation(
		() =>
			axios.post(reqLogoutUrl, null, { withCredentials: true }).then(async res => {
				return res.data;
			}),
		{
			onSuccess(data) {
				console.log('Workspace res >>>>> ', data);
				navigate('/login');
			},
			onError(error) {
				console.log('Failed', error);
			},
			onSettled() {
				console.log('Mutation completed.');
			},
		}
	);

	const onLogout = useCallback(() => {
		/*axios
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
			});*/
		logoutMutation.mutate();
	}, []);

	console.log('Workspace data1 >>>>> ', loginUserInfoData);

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

	const onCreateWorkspaceMutation = useMutation(
		() =>
			axios
				.post(
					'/api/workspaces',
					{
						workspace: newWorkspace,
						url: newUrl,
					},
					{ withCredentials: true }
				)
				.then(async res => {
					return res.data;
				}),
		{
			onSuccess(data) {
				console.log('Workspace res >>>>> ', data);
				setShowCreateWorkspaceModal(false);
				setNewWorkspace('');
				setNewUrl('');
				//	toast.success('생성완료', { position: 'bottom-center' });
				alert('생성완료');
			},
			onError(error) {
				console.log('Failed', error);
			},
			onSettled() {
				console.log('onCreateWorkspaceMutation completed.');
			},
		}
	);

	const onCreateWorkspace = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault(); // form submit 할때 새로고침 안되게 함.
			if (!newWorkspace || !newWorkspace.trim()) {
				return;
			}
			if (!newUrl || !newUrl.trim()) {
				return;
			}

			/*axios
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
				});*/
			onCreateWorkspaceMutation.mutate();
		},
		[newWorkspace, newUrl]
	);

	const onCloseModal = useCallback(() => {
		setShowCreateWorkspaceModal(false);
		setShowCreateChannelModal(false);
		setShowInviteWorkspaceModal(false);
		setShowInviteChannelModal(false);
	}, []);

	const toggleWorkspaceModal = useCallback(() => {
		setShowWorkspaceModal(prev => !prev);
	}, []);

	const onClickAddChannel = useCallback(() => {
		setShowCreateChannelModal(true);
	}, []);

	const onClickInviteWorkspace = useCallback(() => {
		setShowInviteWorkspaceModal(true);
	}, []);

	return (
		<div>
			<Header>
				<RightMenu>
					<span onClick={onClickUserProfile}>
						<ProfileImg
							src={gravatar.url((loginUserInfoData as IUser)?.nickname, { s: '28px', d: 'retro' })}
							alt={(loginUserInfoData as IUser)?.email}
						></ProfileImg>
						{showUserMenu && (
							<Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
								<ProfileModal>
									<img
										src={gravatar.url((loginUserInfoData as IUser)?.nickname, {
											s: '36px',
											d: 'retro',
										})}
										alt={(loginUserInfoData as IUser)?.email}
									/>
									<div>
										<span id="profile-name">{(loginUserInfoData as IUser)?.nickname}</span>
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
					{(loginUserInfoData as IUser)?.Workspaces?.map(ws => {
						return (
							<Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
								<WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
							</Link>
						);
					})}
					<AddButton onClick={onClickCreateWorkspace}>+</AddButton>
				</Workspaces>
				<Channels>
					<WorkspaceName onClick={toggleWorkspaceModal}>Sleact</WorkspaceName>
					<MenuScroll>
						<Menu
							show={showWorkspaceModal}
							onCloseModal={toggleWorkspaceModal}
							style={{ top: 95, left: 80 }}
						>
							<WorkspaceModal>
								<button onClick={onClickInviteWorkspace}>워크스페이스에 사용자 초대</button>
								<button onClick={onClickAddChannel}>채널만들기</button>
								<button onClick={onLogout}>로그아웃</button>
							</WorkspaceModal>
						</Menu>
						<ChannelList />
						<DMList />
					</MenuScroll>
				</Channels>
				<Chats>
					<Routes>
						<Route path="channel/:channel" element={<Channel />} />
						<Route path="dm/:id" element={<DirectMessage />} />
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
			<CreateChannelModal
				show={showCreateChannelModal}
				onCloseModal={onCloseModal}
				setShowCreateChannelModal={setShowCreateChannelModal}
			/>
			<InviteWorkspaceModal
				show={showInviteWorkspaceModal}
				onCloseModal={onCloseModal}
				setShowInviteWorkspaceModal={setShowInviteWorkspaceModal}
			/>
			<InviteChannelModalModal
				show={showInviteWorkspaceModal}
				onCloseModal={onCloseModal}
				setShowInviteChannelModal={setShowInviteChannelModal}
			/>
		</div>
	);
};

export default Workspace;

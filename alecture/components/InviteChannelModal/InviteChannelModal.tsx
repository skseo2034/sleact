import Modal from '@components/Modal/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/signUpStyle';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import axios, { AxiosError } from 'axios';
import React, { FC, useCallback } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { useMutation, useQuery } from 'react-query';

interface Props {
	show: boolean;
	onCloseModal: () => void;
	setShowInviteChannelModal: (flag: boolean) => void;
}

const reqUserInfoUrl = '/api/users';

const InviteChannelModal: FC<Props> = ({ show, onCloseModal, setShowInviteChannelModal }) => {
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();
	console.log('seo >>>>>>>>>>>>>>>>>>', useParams());
	const [newMember, onChangeNewMember, setNewMember] = useInput('');
	// const { data: userData } = useSWR<IUser>('/api/users', fetcher);
	const { data: userData } = useQuery('loginUserInfo', () => fetcher({ fetchUrl: reqUserInfoUrl }), {
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

	/*const { mutate } = useSWR<IUser[]>(
		userData && channel ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
		fetcher
	);*/

	const channelMemberUrl = `/api/workspaces/${workspace}/channels/${channel}/members`;

	const { data: channelMemberData } = useQuery('channelMemberData', () => fetcher({ fetchUrl: channelMemberUrl }), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		enabled: !!userData && !!channel,
		onSuccess: data => {
			// 성공시 호출
			console.log('channelMemberData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log('InviteChannelModal getChannelMemebrData Error', e.message);
		},
	});

	const mutation = useMutation<IUser, AxiosError, { email: string }>(
		data =>
			axios
				.post(`/api/workspaces/${workspace}/channels/${channel}/members`, data, { withCredentials: true })
				.then(res => res.data),
		{
			onMutate() {
				setShowInviteChannelModal(false);
				setNewMember('');
			},
			onSuccess(data) {
				console.log('onInviteMember Succesful', data);
			},
			onError(error: any) {
				console.dir(error);
				toast.error(error.response?.data, { position: 'bottom-center' });
			},
			onSettled() {
				console.log('Mutation completed.');
			},
		}
	);

	const onInviteMember = useCallback(
		(e: any) => {
			e.preventDefault();
			if (!newMember || !newMember.trim()) {
				return;
			}
			/*axios
				.post(`/api/workspaces/${workspace}/channels/${channel}/members`, {
					email: newMember,
				})
				.then(async () => {
					await mutate();
					setShowInviteChannelModal(false);
					setNewMember('');
				})
				.catch(error => {
					console.dir(error);
					toast.error(error.response?.data, { position: 'bottom-center' });
				});*/
			mutation.mutate({ email: newMember });
		},
		[newMember]
	);

	return (
		<Modal show={show} onCloseModal={onCloseModal}>
			<form onSubmit={onInviteMember}>
				<Label id="member-label">
					<span>채널 멤버 초대</span>
					<Input id="member" value={newMember} onChange={onChangeNewMember} />
				</Label>
				<Button type="submit">초대하기</Button>
			</form>
		</Modal>
	);
};

export default InviteChannelModal;

import React, { Dispatch, SetStateAction, useCallback } from 'react';
import Modal, { modalPropsType } from '@components/Modal/Modal';
import { Button, Input, Label } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import { IChannel, IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosError } from 'axios/index';

interface createChannelModalPrposType extends modalPropsType {
	//setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
	setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: React.FC<createChannelModalPrposType> = ({
	show,
	onCloseModal,
	setShowCreateChannelModal,
}) => {
	const queryClient = useQueryClient();
	const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

	// const API_URL = process.env.REACT_APP_API_URL;
	// const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';

	/*const { data, error, mutate } = useSWR<IUser | boolean>(reqUserInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});*/

	const { isLoading, isError, data, error } = useQuery('loginUserInfo', () => fetcher({ fetchUrl: reqUserInfoUrl }), {
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

	/*const {
		data: channelData,
		error: errorChannel,
		mutate: mutateChannel,
	} = useSWR<IChannel[]>(data ? `/api/workspaces/${workspace}/channels` : null, fetcher);*/

	const channelUrl = `/api/workspaces/${workspace}/channels`;
	const { data: channelData } = useQuery('channelData', () => fetcher({ fetchUrl: channelUrl }), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		onSuccess: data => {
			// 성공시 호출
			console.log('channelData', data);
		},
		onError: (e: any) => {
			// 실패시 호출 (401, 404 같은 error가 아니라 정말 api 호출이 실패한 경우만 호출됩니다.)
			// 강제로 에러 발생시키려면 api단에서 throw Error 날립니다. (참조: https://react-query.tanstack.com/guides/query-functions#usage-with-fetch-and-other-clients-that-do-not-throw-by-default)
			console.log(e.message);
		},
	});

	const mutation = useMutation<IUser, AxiosError, { name: string }>(
		data =>
			axios.post(`/api/workspaces/${workspace}/channels`, data, { withCredentials: true }).then(res => res.data),
		{
			onMutate() {
				setShowCreateChannelModal(false);
				setNewChannel('');
			},
			async onSuccess(data) {
				// console.log('resLogInUserInfo Succesful', data);
				// navigate('/workspace/Sleact/channel/일반');
				queryClient.refetchQueries(['workspace', workspace, 'channelData']);
			},
			onError(error) {
				console.log('Failed', error);
				// setLogInError(error.response?.data?.code === 401);
			},
			onSettled() {
				console.log('Login Mutation completed.');
			},
		}
	);

	const onCreateChannel = useCallback(
		(e: any) => {
			e.preventDefault();
			/*axios
				.post(
					`/api/workspaces/${workspace}/channels`,
					{
						name: newChannel,
					},
					{
						withCredentials: true,
					}
				)
				.then(async () => {
					await mutateChannel();
					setShowCreateChannelModal(false);
					setNewChannel('');
				})
				.catch(error => {
					console.dir(error);
					toast.error(error.response?.data, { position: 'bottom-right' });
				});*/
			mutation.mutate({ name: newChannel });
		},
		[newChannel]
	);

	return (
		<Modal show={show} onCloseModal={onCloseModal}>
			<form onSubmit={onCreateChannel}>
				<Label id="channel-label">
					<span>채널</span>
					<Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
				</Label>
				<Button type="submit">생성하기</Button>
			</form>
		</Modal>
	);
};

export default CreateChannelModal;

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

interface createChannelModalPrposType extends modalPropsType {
	//setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
	setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: React.FC<createChannelModalPrposType> = ({
	show,
	onCloseModal,
	setShowCreateChannelModal,
}) => {
	const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
	const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

	// const API_URL = process.env.REACT_APP_API_URL;
	// const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';

	const { data, error, mutate } = useSWR<IUser | boolean>(reqUserInfoUrl, fetcher, {
		dedupingInterval: 2000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});

	const {
		data: channelData,
		error: errorChannel,
		mutate: mutateChannel,
	} = useSWR<IChannel[]>(data ? `/api/workspaces/${workspace}/channels` : null, fetcher);

	const onCreateChannel = useCallback(
		(e: any) => {
			e.preventDefault();
			axios
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
				});
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

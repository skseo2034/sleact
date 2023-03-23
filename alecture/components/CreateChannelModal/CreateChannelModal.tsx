import React, { Dispatch, SetStateAction, useCallback } from 'react';
import Modal, { modalPropsType } from '@components/Modal/Modal';
import { Button, Input, Label } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';

interface createChannelModalPrposType extends modalPropsType {
	setShowCreateChannelModal: Dispatch<SetStateAction<boolean>>;
}

const CreateChannelModal: React.FC<createChannelModalPrposType> = ({ show, onCloseModal }) => {
	const [newChannel, onChangeNewChannel] = useInput('');

	const onCreateChannel = useCallback(() => {}, []);

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

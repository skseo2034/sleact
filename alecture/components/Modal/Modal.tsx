import React, { useCallback } from 'react';
import { CloseModalButton, CreateModal } from '@components/Modal/modalStyle';

export interface modalPropsType {
	show: boolean;
	onCloseModal: () => void;
	children?: React.ReactNode;
}

/*const Modal: React.FC<modalPropsType> = props => {
	const { show, onCloseModal } = props;*/
const Modal: React.FC<modalPropsType> = ({ show, children, onCloseModal }) => {
	const stopPropagation = useCallback((e: any) => {
		e.stopPropagation();
	}, []);

	if (!show) {
		return null;
	}

	return (
		<CreateModal onClick={onCloseModal}>
			<div onClick={stopPropagation}>
				<CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
				{children}
			</div>
		</CreateModal>
	);
};

export default Modal;

import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from '@components/Menu/menuStyle';
interface Props {
	children?: React.ReactNode;
	style: CSSProperties;
	show: boolean;
	onCloseModal: (e: any) => void;
	closeButton?: boolean;
}
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
	const stopPropagation = useCallback((e: any) => {
		e.stopPropagation();
	}, []);

	if (!show) {
		return null;
	}

	return (
		<CreateMenu onClick={onCloseModal}>
			<div style={style} onClick={stopPropagation}>
				{closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
				{children}
			</div>
		</CreateMenu>
	);
};

Menu.defaultProps = {
	closeButton: true,
};

export default Menu;

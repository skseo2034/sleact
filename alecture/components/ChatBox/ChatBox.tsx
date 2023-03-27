import React, { FC, useCallback } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/chatBoxStyles';
import { Mention } from 'react-mentions';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import { useParams } from 'react-router';

interface Props {
	chat: string;
}

const ChatBox: FC<Props> = ({ chat }) => {
	const { workspace } = useParams<string>();
	const reqUserInfoUrl = '/api/users';
	const {
		data: userData,
		error,
		mutate,
	} = useSWR<IUser | boolean>(reqUserInfoUrl, fetcher, {
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄, 캐시의 유지기간. 즉 100초 안에 아무리 많은 요청을 보내도 캐시데이터를 사용한다.
	});
	const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
	const onSubmitForm = useCallback((e: any) => {
		e.preventDefault();
	}, []);

	return (
		<ChatArea>
			<Form onSubmit={onSubmitForm}>
				<MentionsTextarea>
					<textarea />
				</MentionsTextarea>
				<Toolbox>
					<SendButton
						className={
							'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
							(chat?.trim() ? '' : ' c-texty_input__button--disabled')
						}
						data-qa="texty_send_button"
						aria-label="Send message"
						data-sk="tooltip_parent"
						type="submit"
						disabled={!chat?.trim()}
					>
						<i className="c-icon c-icon--paperplane-filled" aria-hidden="true" />
					</SendButton>
				</Toolbox>
			</Form>
		</ChatArea>
	);
};

export default ChatBox;

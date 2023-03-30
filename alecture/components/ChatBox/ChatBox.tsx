import React, { FC, useCallback, useEffect, useRef } from 'react';
import { ChatArea, Form, MentionsTextarea, SendButton, Toolbox } from '@components/ChatBox/chatBoxStyles';
import { Mention } from 'react-mentions';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import autosize from 'autosize';
import { useQuery } from 'react-query';

interface Props {
	chat: string;
	onSubmitForm: (e: any) => void;
	onChangeChat: (e: any) => void;
	placeholder?: string;
}

const ChatBox: FC<Props> = ({ chat, onSubmitForm, onChangeChat, placeholder }) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		if (textareaRef.current) {
			autosize(textareaRef.current);
		}
	}, []);

	const { workspace } = useParams<string>();
	const reqUserInfoUrl = '/api/users';
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
		data: userData,
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

	/*const { data: memberData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);*/
	const reqMemberDataUrl = `/api/workspaces/${workspace}/members`;
	const { data: memberData } = useQuery(['workspaceMemberData', reqMemberDataUrl], () => fetcher(reqMemberDataUrl), {
		refetchOnWindowFocus: false, // react-query는 사용자가 사용하는 윈도우가 다른 곳을 갔다가 다시 화면으로 돌아오면 이 함수를 재실행합니다. 그 재실행 여부 옵션 입니다.
		retry: 0, // 실패시 재호출 몇번 할지
		enabled: !!userData, // true 이면 실행, 즉, loginUserInfoData가 있으면 실행
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

	const onKeyDownChat = (e: any) => {
		console.log('onKeyDownChat', e);
		console.log('onKeyDownChat shiftKey', e.key, e.shiftKey);
		if (e.key == 'Enter') {
			if (!e.shiftKey) {
				console.log('onSubmitForm call');
				onSubmitForm(e);
			}
		}
	};

	return (
		<ChatArea>
			<Form onSubmit={onSubmitForm}>
				<MentionsTextarea
					id="editor-chat"
					value={chat}
					onChange={onChangeChat}
					onKeyDown={onKeyDownChat}
					placeholder={placeholder}
					ref={textareaRef}
				></MentionsTextarea>
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

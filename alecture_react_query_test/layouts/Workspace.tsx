import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import { fetcher } from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { api } from '@utils/api';
import { QueryClientProvider, useQuery, useMutation } from 'react-query';

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	const { isLoading, isError, data, error } = useQuery('loginUserInfo', fetcher, {
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

	if (error) {
		console.log('error', error);
		//return "An error has occurred: " + error;
	}
	console.log('workspace data >>>> ', data);
	const onLogout = useCallback(() => {
		axios
			.post('/api/users/logout', null, {
				withCredentials: true, // 쿠키를 항상 공유하기 위해서 true 로 함.
			})
			.then(res => {
				console.log('Workspace res >>>>> ', res);
				return res.data;
			})
			.catch(error => {
				console.log('에러발생11 >>>> ', error);
			});
	}, []);

	console.log('Workspace data1 >>>>> ', data);

	if (data == 'ok' || !data) {
		console.log('login 으로 이동', data == 'ok');
		navigate('/login');
	}

	return (
		<div>
			<button onClick={onLogout}>로그아웃</button>
			{children}
		</div>
	);
};

export default Workspace;

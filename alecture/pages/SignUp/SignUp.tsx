import React, { ChangeEventHandler, useCallback, useEffect, useState } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from './signUpStyle';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import useSWR from 'swr';
import useInput from '../../hooks/useInput';
import { fetcher } from '../../utils/fetcher';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { IUser } from '@typings/db';
import { AxiosError } from 'axios/index';

const SingUp = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqUserInfoUrl = '/api/users';
	/*const { data, error, mutate } = useSWR(reqUserInfoUrl, fetcher, {
		// data 나 error 이 바뀌면 리랜더링 된다.
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄
	});*/

	const {
		isLoading,
		isError,
		data: loginUserInfoData,
		error,
	} = useQuery('loginUserInfo', () => fetcher({ fetchUrl: reqUserInfoUrl }), {
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

	// const { data, isLoading, error } = fetcher1(reqUserInfoUrl);
	// const [email, setEmail] = useState('');
	const [email, onChangeEmail, setEmail] = useInput('');
	// const [nickname, setNickname] = useState('');
	const [nickname, onChangeNickname, setNickname] = useInput('');
	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [mismatchError, setMismatchError] = useState(false);
	const [signUpError, setSignUpError] = useState('');
	const [signUpSuccess, setSignUpSuccess] = useState(false);

	const mutation = useMutation<IUser, AxiosError, { email: string; nickname: string; password: string }>(
		'loginUserInfo',
		data => axios.post(reqSignUrl, data, { withCredentials: true }).then(res => res.data),
		{
			onMutate() {
				setSignUpSuccess(true);
			},
			async onSuccess(data) {
				// console.log('resLogInUserInfo Succesful', data);
				// navigate('/workspace/Sleact/channel/일반');

				await queryClient.refetchQueries('loginUserInfo');
			},
			onError(error) {
				console.log('Failed', error);
				setSignUpError(error.message);
				// setLogInError(error.response?.data?.code === 401);
			},
			onSettled() {
				console.log('SignUp Mutation completed.');
			},
		}
	);

	// const reqSignUrl = `${API_URL}:${PORT}/api/users`; // 로컬호스트 3090이 3095에게 보내는 요청.
	const reqSignUrl = '/api/users'; // 로컬호스트 3095가 3095에게 보내는 요청.
	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (!mismatchError) {
				console.log('서버로 회원가입하기');

				// 비동기 요청전 요청으로 set 되는 값들은 초기화 하는게 좋다.
				// 여러 요청으로 인해 이전값이 저장 되어 있을수 있다.
				setSignUpSuccess(false);
				setSignUpError('');

				/*axios
					.post(reqSignUrl, {
						email,
						nickname,
						password,
					})
					.then(response => {
						console.log(response);
						setSignUpSuccess(true);
					})
					.catch(error => {
						setSignUpError(error.response.data);
					})
					.finally(() => {
						// finally code
					});*/
				mutation.mutate({ email, nickname, password });
			}
		},
		[email, nickname, password, passwordCheck]
	);

	const onChangePassword = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(e.target.value);
			setMismatchError(e.target.value !== passwordCheck);
			console.log(mismatchError);
		},
		[passwordCheck]
	);

	const onChangePasswordCheck = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setPasswordCheck(e.target.value);
			setMismatchError(e.target.value !== password);
			console.log(mismatchError);
		},
		[password]
	);

	console.log('SignUp loginUserInfoData >>> ', loginUserInfoData);

	/*useEffect(() => {
		console.log('sing up use effect1 >>>>> ', data);
		// useEffect 처리 하지 않으면 warning 발생 함.
		if (data) {
			// navigate('/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
			navigate('/workspace/channel');
		}
	}, [data]);*/

	/*if (!data) {
		return <div>Loading....</div>
	}*/

	if (loginUserInfoData) {
		console.log('SignUp 페이지 -> 채널페이지로 이동');
		navigate('/workspace/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
	}

	return (
		<div id="container">
			<Header>Sleact</Header>
			<Form onSubmit={onSubmit}>
				<Label id="email-label">
					<span>이메일 주소</span>
					<div>
						<Input
							type="email"
							id="email"
							name="email"
							value={email as string}
							onChange={onChangeEmail as ChangeEventHandler<HTMLInputElement>}
						/>
					</div>
				</Label>
				<Label id="nickname-label">
					<span>닉네임</span>
					<div>
						<Input
							type="text"
							id="nickname"
							name="nickname"
							value={nickname as string}
							onChange={onChangeNickname as ChangeEventHandler<HTMLInputElement>}
						/>
					</div>
				</Label>
				<Label id="password-label">
					<span>비밀번호</span>
					<div>
						<Input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={onChangePassword}
						/>
					</div>
				</Label>
				<Label id="password-check-label">
					<span>비밀번호 확인</span>
					<div>
						<Input
							type="password"
							id="password-check"
							name="password-check"
							value={passwordCheck}
							onChange={onChangePasswordCheck}
						/>
					</div>
					{mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
					{!nickname && <Error>닉네임을 입력해주세요.</Error>}
					{signUpError && <Error>{signUpError}</Error>}
					{signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
				</Label>
				<Button type="submit">회원가입</Button>
			</Form>
			<LinkContainer>
				이미 회원이신가요?&nbsp;
				<Link to="/login">로그인 하러가기</Link>
			</LinkContainer>
		</div>
	);
};

export default SingUp;

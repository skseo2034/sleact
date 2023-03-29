import React, { useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { useQuery, useMutation } from 'react-query';
import { abortControllerWithReason } from '@reduxjs/toolkit/dist/listenerMiddleware/utils';
import { fetcher } from '@utils/fetcher';

const Login = () => {
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, setpassword] = useState('');
	const [logInError, setLogInError] = useState(false);
	const navigate = useNavigate();

	const reqLogInUrl = '/api/users/login';
	const reqUserInfoUrl = '/api/users';

	// useQuery 첫번째 unique key 값 다른데서 참조한다. 배열로 할 수 있다. [유니크키값, 함수파라메터]
	// 두번째 비동기함수(api 호출함수)
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

	if (isError) {
		console.log('error', error.message);
		//return "An error has occurred: " + error;
	}

	const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setpassword(e.target.value);
	}, []);

	const mutation = useMutation(
		() =>
			axios.post(reqLogInUrl, { email, password }, { withCredentials: true }).then(async res => {
				return res.data;
			}),
		{
			onSuccess(data) {
				console.log('resLogInUserInfo Succesful', data);
				navigate('/workspace/channel');
			},
			onError(error) {
				console.log('Failed', error);
				setLogInError(true);
			},
			onSettled() {
				console.log('Mutation completed.');
			},
		}
	);

	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			// await mutation.mutateAsync();
			mutation.mutate();
		},
		[email, password]
	);
	console.log('data >>>> ', data);

	if (data) {
		console.log('채널페이지로 이동');
		navigate('/workspace/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
	}

	return (
		<div id="container">
			<Header>Sleact</Header>
			<Form onSubmit={onSubmit}>
				<Label id="email-label">
					<span>이메일 주소</span>
					<div>
						<Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
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
					{logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
				</Label>
				<Button type="submit">로그인</Button>
			</Form>
			<LinkContainer>
				아직 회원이 아니신가요?&nbsp;
				<Link to="/signup">회원가입 하러가기</Link>
			</LinkContainer>
		</div>
	);
};

export default Login;

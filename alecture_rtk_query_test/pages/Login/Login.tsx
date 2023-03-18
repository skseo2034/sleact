import React, { useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';
import axios, { AxiosResponse } from 'axios';
import useSWR from 'swr';
import { fetcher } from '@utils/fetcher';
import {api} from "@utils/api";

const Login = () => {
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, setpassword] = useState('');
	const [logInError, setLogInError] = useState(false);
	const navigate = useNavigate();

	const reqLogInUrl = '/api/users/login';
	const reqUserInfoUrl = '/api/users';
	const name = 'userInfo';
	const query = api.useGetCountQuery({name});
	console.log('query', query);
	const mutation = api.useSetCountMutation();
	const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setpassword(e.target.value);
	}, []);

	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			setLogInError(false);

			axios
				.post(reqLogInUrl, { email, password }, { withCredentials: true })
				.then(async res => {
					console.log('로그인 성공 >>>> ', query);
					mutation[0];
					navigate('/workspace/channel');
				})
				.catch(error => {
					setLogInError(error.response?.data?.statusCode === 401);
				})
				.finally(() => {
					//...
				});
		},
		[email, password]
	);

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

import React, { useCallback, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';
import axios from 'axios';

const Login = () => {
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, setpassword] = useState('');
	const [logInError, setLogInError] = useState(false);
	const navigate = useNavigate();

	// const API_URL = process.env.REACT_APP_API_URL;
	// const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqLogInUrl = `${API_URL}:${PORT}/api/users/login`;
	const reqLogInUrl = '/api/users/login';

	const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setpassword(e.target.value);
	}, []);

	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			axios
				.post(reqLogInUrl, { email, password })
				.then(res => {
					console.log('로그인 성공');
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					navigate('/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
					//	navigate('/channel');
				})
				.catch(() => {
					setLogInError(true);
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

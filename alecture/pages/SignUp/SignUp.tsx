import React, { ChangeEventHandler, useCallback, useState } from 'react';
import { Header, Form, Label, Input, Button, Error, Success, LinkContainer } from './signUpStyle';
import { Link } from 'react-router-dom';
import useInput from '@hooks/useInput';
import axios from 'axios';

const SingUp = () => {
	// const [email, setEmail] = useState('');
	const [email, onChangeEmail, setEmail] = useInput('');
	// const [nickname, setNickname] = useState('');
	const [nickname, onChangeNickname, setNickname] = useInput('');
	const [password, setPassword] = useState('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [mismatchError, setMismatchError] = useState(false);
	const [signUpError, setSignUpError] = useState('');
	const [signUpSuccess, setSignUpSuccess] = useState(false);

	// console.log(process.env.DEV);
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	// console.log(API_URL);
	// const regMemUrl = `${API_URL}:${PORT}/api/users`; // 로컬호스트 3090이 3095에게 보내는 요청.
	const regMemUrl = '/api/users'; // 로컬호스트 3095가 3095에게 보내는 요청.
	const onSubmit = useCallback(
		(e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			if (!mismatchError) {
				console.log('서버로 회원가입하기');

				// 비동기 요청전 요청으로 set 되는 값들은 초기화 하는게 좋다.
				// 여러 요청으로 인해 이전값이 저장 되어 있을수 있다.
				setSignUpSuccess(false);
				setSignUpError('');

				axios
					.post(regMemUrl, {
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
					.finally(() => {});
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

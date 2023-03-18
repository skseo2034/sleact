import React, { useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '@pages/SignUp/signUpStyle';
import useInput from '@hooks/useInput';
import axios from 'axios';
import {useQuery, useMutation} from "react-query";
import {abortControllerWithReason} from "@reduxjs/toolkit/dist/listenerMiddleware/utils";

const Login = () => {
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, setpassword] = useState('');
	const [logInError, setLogInError] = useState(false);
	const navigate = useNavigate();

	const reqLogInUrl = '/api/users/login';
	const reqUserInfoUrl = '/api/users';

	const { isFetching, isLoading, error, data } = useQuery("userLoginData", () =>
		axios.get("/api/users").then(res => res.data)
	);
	if (isFetching) {
		console.log("FETCHING");
	}
	if (isLoading) {
		console.log("LOADING");
		//return "Loading...";
	}

	if (error) {
		console.log("error", error);
		//return "An error has occurred: " + error;
	}

	const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setpassword(e.target.value);
	}, []);

	const mutation = useMutation(
		() =>
			axios.post(reqLogInUrl, { email, password }, { withCredentials: true })
				.then(async res => {
					return res.data;
				}),
		{
			onSuccess(data) {
				console.log("Succesful", data);
				navigate('/workspace/channel');
			},
			onError(error) {
				console.log("Failed", error);
				setLogInError(true);
			},
			onSettled() {
				console.log("Mutation completed.");
			}
		}
	);

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			await mutation.mutateAsync();
		},
		[email, password]
	);
	console.log('data >>>> ', data);

	if (data) {
		console.log('채널페이지로 이동');
		navigate('/channel', { state: { email: email } }); // 회원 메인 페이지로 이동

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

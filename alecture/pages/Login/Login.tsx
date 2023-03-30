import React, { useCallback, useEffect, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Form, Header, Input, Label, LinkContainer, Error } from '../SignUp/signUpStyle';
import axios, { AxiosResponse } from 'axios';
// import useSWR, {mutate} from 'swr';
import useSWR from 'swr';
import useInput from '../../hooks/useInput';
import { fetcher } from '../../utils/fetcher';
import { useMutation, useQuery } from 'react-query';

const Login = () => {
	const [email, onChangeEmail, setEmail] = useInput('');
	const [password, setpassword] = useState('');
	const [logInError, setLogInError] = useState(false);
	const navigate = useNavigate();

	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	// const reqLogInUrl = `${API_URL}:${PORT}/api/users/login`;
	// const reqUserInfoUrl = `${API_URL}:${PORT}/api/users`;
	const reqLogInUrl = '/api/users/login';
	const reqUserInfoUrl = '/api/users';
	/*const { data, error, mutate } = useSWR(reqUserInfoUrl, fetcher, {
		// data 나 error 이 바뀌면 리랜더링 된다.
		dedupingInterval: 100000, // default 2000 즉 2초마다 서버에 요청을 보냄
	});*/
	// const { data, isLoading, error } = fetcher1(reqUserInfoUrl);
	const {
		isLoading,
		isError,
		data: loginUserInfoData,
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

	const onChangePassword = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setpassword(e.target.value);
	}, []);

	const { data: localType } = useSWR('localType', key => {
		return 'ko_KR';
	});

	const mutation = useMutation(
		() =>
			axios.post(reqLogInUrl, { email, password }, { withCredentials: true }).then(async res => {
				return res.data;
			}),
		{
			onSuccess(data) {
				console.log('resLogInUserInfo Succesful', data);
				navigate('/workspace/Sleact/channel/일반');
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
			setLogInError(false);
			/*axios
				.post(reqLogInUrl, { email, password }, { withCredentials: true })
				.then(async res => {
					console.log('로그인 성공', data, res.data);
					//	navigate('/workspace/channel');
					// await mutate(reqUserInfoUrl, res.data, false); // swr 에 mutate 사용시, true 서버로 요청 보내서 다시가지고 옴, false 서버요청 다시 안보냄
					await mutate(res.data, false); // useSWR 에 mutate 사용시, true 서버로 요청 보내서 다시가지고 옴, false 서버요청 다시 안보냄
					// 서버에 요청을 보내야 할 상황이면 true 를 해야함. false 는 로컬만 변경한다.
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					// navigate('/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
					//	navigate('/channel');
					navigate('/workspace/Sleact/channel/일반');
				})
				.catch(error => {
					setLogInError(error.response?.data?.statusCode === 401);
				})
				.finally(() => {
					//...
				});*/
			mutation.mutate();
		},
		[email, password]
	);

	console.log('Login data >>>>> ', loginUserInfoData);

	/*useEffect(() => {
		console.log('Login useEffect change data >>>>> ', data);
		// useEffect 처리 하지 않으면 warning 발생 함.
		if (data) {
			console.log('채널페이지로 이동');
			// navigate('/channel', { state: { email: email } }); // 회원 메인 페이지로 이동
			navigate('/workspace/channel');
		}
	}, [data]);*/

	if (loginUserInfoData) {
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

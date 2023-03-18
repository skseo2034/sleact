import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import {fetcher} from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {api} from "@utils/api";
import {QueryClientProvider, useQuery, useMutation} from "react-query";

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
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

import React, { FC, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import {fetcher} from '@utils/fetcher';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {api} from "@utils/api";

type Props = {
	children?: React.ReactNode;
};

const Workspace: FC<Props> = ({ children }) => {
	const navigate = useNavigate();
	const API_URL = process.env.REACT_APP_API_URL;
	const PORT = process.env.REACT_APP_PORT; // 3095
	const name = 'userInfo1';
	const query = api.useGetCountQuery({name});
	console.log('workspace query', query);
	console.log('workspace query111', query.data);

	const onLogout = useCallback(() => {
		/*axios
			.post(reqLogoutUrl, null, {
				withCredentials: true, // 쿠키를 항상 공유하기 위해서 true 로 함.
			})
			.then(async res => {
				console.log('Workspace res >>>>> ', res);
				await mutate(res.data, true);
			})
			.catch(error => {
				console.log('에러발생 >>>> ', error.response);
			});*/
	}, []);

	//console.log('Workspace data1 >>>>> ', data);



	return (
		<div>
			<button onClick={onLogout}>로그아웃</button>
			{children}
		</div>
	);
};

export default Workspace;

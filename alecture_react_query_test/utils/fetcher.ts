import axios from 'axios';
import useSWR, { mutate } from 'swr';

export const fetcher = async () => {
	const res = await axios.get('/api/users', { withCredentials: true });
	return res.data;
};

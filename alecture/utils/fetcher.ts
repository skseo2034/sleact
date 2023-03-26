import axios from 'axios';

export const fetcher = async (url: string) => {
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
};

import axios from 'axios';

// export const fetcher = async (url: string) => {
export const fetcher = async ({ fetchUrl }: { fetchUrl: string }) => {
	const res = await axios.get(fetchUrl, { withCredentials: true });
	return res.data;
};

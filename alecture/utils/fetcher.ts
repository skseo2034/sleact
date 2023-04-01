import axios from 'axios';

export const fetcher = async ({ fetchUrl }: { fetchUrl: string }) => {
	const res = await axios.get(fetchUrl, { withCredentials: true });
	return res.data;
};

export const Swrfetcher = async (url: string) => {
	console.log('Swrfetcher', url);
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
};

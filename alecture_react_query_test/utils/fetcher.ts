import axios from 'axios';
import useSWR, {mutate} from "swr";

export const fetcher = async (url: string) => {
	const res = await axios.get(url, { withCredentials: true });
	return res.data;
};
import axios from 'axios';
import useSWR, {mutate} from "swr";

export const fetcher = (url: string) => {
	console.log('fetcher >>>> ', url);
	const { data, isValidating, error } = useSWR<any>(
		url, async () => {
			// 비동기 통신 부분
			const res = await axios.get(url,  { withCredentials: true });
			console.log('fetcher1111 >>>> ', res.data);
			return res.data
		},
	);


  console.log('aaaa >>>>>> ', data, isValidating, error);
	return {
		data,
		isLoading: isValidating,
		error,
	};
};

import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

/*const useInput = (initialData: string) => {
	const [value, setValue] = useState(initialData);
	const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	}, []);

	return [value, handler, setValue];
};*/

const useInput = <T = any>(
	initialData: T
): [T, (e: React.ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {
	const [value, setValue] = useState(initialData);
	const handler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value as unknown as T);
	}, []);

	return [value, handler, setValue];
};

export default useInput;

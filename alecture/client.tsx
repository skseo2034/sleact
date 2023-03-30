import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import App from '@layouts/App/App';

const queryClient = new QueryClient();
const container = document.getElementById('app') as HTMLDivElement;
const root = createRoot(container);
root.render(
	<QueryClientProvider client={queryClient}>
		<App />
		<ReactQueryDevtools initialIsOpen={true} />
	</QueryClientProvider>
);

import * as React from 'react';
import App from './layouts/App';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app') as HTMLDivElement;
const root = createRoot(container);
root.render(<App />);

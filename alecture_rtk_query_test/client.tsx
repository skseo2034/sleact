import * as React from 'react';
import App from './layouts/App';
import { createRoot } from 'react-dom/client';
import {ApiProvider} from "@reduxjs/toolkit/dist/query/react";
import {api} from "@utils/api";

const container = document.getElementById('app') as HTMLDivElement;
const root = createRoot(container);
root.render(
    <ApiProvider api={api}>
        <App />
    </ApiProvider>
    );

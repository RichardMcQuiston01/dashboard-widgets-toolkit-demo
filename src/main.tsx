import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

const rootElement: HTMLElement | null = document.getElementById('root');
if (rootElement === null) {
  throw new Error('Missing #root element in index.html; cannot mount the app.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);


import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
    <BrowserRouter>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
      </ClerkProvider>
    </BrowserRouter>
    </MantineProvider>
  </StrictMode>
)};

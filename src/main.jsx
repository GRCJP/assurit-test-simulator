import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { TestModeProvider } from './contexts/TestModeContext'
import './index.css'
import App from './App.jsx'

function showFatalError(err) {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;
  const message = err && err.message ? err.message : String(err);
  rootEl.innerHTML = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 16px;">
      <h1 style="font-size: 18px; margin: 0 0 8px;">App Error</h1>
      <pre style="white-space: pre-wrap; word-break: break-word; font-size: 12px;">${message}</pre>
    </div>
  `;
}

window.addEventListener('error', (e) => {
  if (e && e.error) showFatalError(e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  showFatalError(e && e.reason ? e.reason : e);
});

try {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
  const redirectUri = import.meta.env.VITE_AUTH0_REDIRECT_URI || `${window.location.origin}/assurit-test-simulator`;

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          redirect_uri: redirectUri,
          scope: 'openid profile email',
        }}
      >
        <TestModeProvider>
          <App />
        </TestModeProvider>
      </Auth0Provider>
    </StrictMode>,
  );
} catch (err) {
  console.error('Error in main.jsx:', err);
  showFatalError(err);
}

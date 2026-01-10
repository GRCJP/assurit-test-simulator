import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <TestModeProvider>
        <App />
      </TestModeProvider>
    </StrictMode>,
  );
} catch (err) {
  console.error('Error in main.jsx:', err);
  showFatalError(err);
}

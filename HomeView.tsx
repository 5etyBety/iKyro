import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Prevent context menu (long press) globally
document.addEventListener('contextmenu', event => event.preventDefault());

// Prevent pinch-zoom on iOS Safari
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

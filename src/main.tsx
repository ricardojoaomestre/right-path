import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ParticlesProvider } from '@tsparticles/react';
import './index.css';
import App from './App.tsx';
import { initStarsEngine } from './particles/init-stars-engine';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParticlesProvider init={initStarsEngine}>
      <App />
    </ParticlesProvider>
  </StrictMode>,
);

import { createRoot } from 'react-dom/client';

import App from './App.js';
import './style.css';

const root = document.getElementById('root');

if (!root) throw new Error('The SCORM test bench root element is missing.');

createRoot(root).render(<App />);

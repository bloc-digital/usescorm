import { createRoot } from 'react-dom/client';

import RemoteApp from './RemoteApp.js';
import '../style.css';

const root = document.getElementById('root');

if (!root) throw new Error('The SCORM test bench root element is missing.');

createRoot(root).render(<RemoteApp />);

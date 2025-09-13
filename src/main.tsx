import { createRoot } from 'react-dom/client';

import App from './App';
import { TableMappingProvider } from './contexts/TableMappingContext';
import './lib/system.css';

createRoot(document.getElementById('root')!).render(
  <TableMappingProvider>
    <App />
  </TableMappingProvider>,
);

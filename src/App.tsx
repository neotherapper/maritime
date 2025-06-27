import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuoteWizard } from './modules/wizard/components/quote-wizard/QuoteWizard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/quote-wizard" replace />} />
        <Route path="/quote-wizard" element={<QuoteWizard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
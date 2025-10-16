import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/episoden" element={<EpisodesPage />} />
      </Routes>
    </>
  );
}

export default App;

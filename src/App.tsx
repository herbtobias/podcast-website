import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import EpisodesPage from './pages/EpisodesPage';
import SyncEpisodesPage from './pages/SyncEpisodesPage';

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/episoden" element={<EpisodesPage />} />
        <Route path="/sync-episodes" element={<SyncEpisodesPage />} />
      </Routes>
    </>
  );
}

export default App;

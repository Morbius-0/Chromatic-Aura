import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Controller } from './pages/Controller';
import { Visualizer } from './pages/Visualizer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Controller />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </Router>
  );
}

export default App;

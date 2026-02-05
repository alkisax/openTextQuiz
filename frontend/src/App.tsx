import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OpenText from './pages/OpenText';
import GeographyMaps from './pages/GeographyMaps';

const App = () => {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/open-text-page' element={<OpenText />} />
        <Route path='/geography-maps' element={<GeographyMaps />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

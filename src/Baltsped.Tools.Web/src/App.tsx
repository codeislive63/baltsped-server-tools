import { Routes, Route } from 'react-router-dom';
import { DmReplace } from './pages/DmReplace';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { TeLookup } from './pages/TeLookup';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/te/lookup" element={<TeLookup />} />
            <Route path="/dm/replace" element={<DmReplace />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;

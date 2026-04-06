import { DmReplace } from './pages/DmReplace';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { TeLookup } from './pages/TeLookup';

function App() {
    const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';

    switch (normalizedPath.toLowerCase()) {
        case '/':
            return <Home />;

        case '/te/lookup':
            return <TeLookup />;

        case '/dm/replace':
            return <DmReplace />;

        default:
            return <NotFound />;
    }
}

export default App;

import { DmReplace } from './pages/DmReplace';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { TeLookup } from './pages/TeLookup';

function App() {
    switch (window.location.pathname.toLowerCase()) {
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
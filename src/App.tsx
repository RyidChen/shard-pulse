import { DashboardPage } from "./pages/DashboardPage";

const SIMULATE_INITIAL_LOAD_ERROR = false;

function App() {
  return (
    <DashboardPage simulateInitialLoadError={SIMULATE_INITIAL_LOAD_ERROR} />
  );
}

export default App;

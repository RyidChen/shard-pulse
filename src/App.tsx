import { DashboardPage } from "./pages/DashboardPage";

// 模擬連線錯誤的開關，開啟後會在初始載入時觸發錯誤，方便測試錯誤 UI。
const SIMULATE_INITIAL_LOAD_ERROR = false;

function App() {
  return (
    <DashboardPage simulateInitialLoadError={SIMULATE_INITIAL_LOAD_ERROR} />
  );
}

export default App;

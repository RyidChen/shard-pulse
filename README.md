# ShardPulse

ShardPulse 是一個使用前端模擬資料製作的即時遊戲伺服器監控 Dashboard。專案用於展示 React 狀態管理、Timer Lifecycle、Derived State、事件處理、SVG 資料視覺化、RWD 與無障礙設計。

## 功能

- 固定監控 Tokyo、Singapore、Seoul、Sydney、US West、Frankfurt 六台 Server
- 每 1.5 秒小幅更新 Ping、Server Load、Players 與 Packet Loss
- 根據 Metrics 推導 Healthy、Warning、Critical 狀態
- 每台保留最近 20 筆 History，使用原生 SVG 顯示 Ping Sparkline
- 重要 Threshold Crossing 與狀態改變才會加入 Event Feed
- Pause／Resume 即時更新
- Server Name Search 與 Status Filter 可同時使用
- Server Detail Drawer 支援 Escape、Focus Trap 與關閉後 Focus 還原
- Simulate Overload 與逐步 Recovery
- Skeleton Loading、Empty State 與可 Retry 的 Demo Error State
- Mobile／Tablet／Desktop 響應式版面

## 技術棧

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4

## 執行方式

```bash
npm install
npm run dev
```

## 驗證

```bash
npm run lint
npm run build
```

## 架構

```text
src/
├─ components/  畫面元件與可存取的互動
├─ data/        固定初始 Server 資料
├─ domain/      Status、Simulator、Events、Selectors 純函式
├─ hooks/       useGameMonitor 與 Timer Lifecycle
├─ pages/       Dashboard 畫面組合
├─ reducers/    Monitor State 與 Actions
└─ types/       Domain TypeScript 型別
```

`monitorReducer` 管理 Servers、Events、Pause 與目前選取的 Server。`useGameMonitor` 封裝 Reducer、初始化延遲、1.5 秒 Interval、Cleanup 與 UI Callback。Search、Filter、Summary 與 Selected Server 都從來源 State 推導，不重複儲存。

Metrics、Status 與 Event 規則位於純函式中，讓測試可以使用固定輸入驗證，不必渲染 UI。

## Demo Error State

將 `src/App.tsx` 中的 `SIMULATE_INITIAL_LOAD_ERROR` 改為 `true`，第一次初始化會顯示 Error State；點擊 Retry 後會正常載入 Dashboard。

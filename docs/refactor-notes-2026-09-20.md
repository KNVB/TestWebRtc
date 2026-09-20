# 會議重構記錄（2026-09-20）

今次 session 為 TestWebRtc POC 做嘅整合同整理記錄。

## 架構原則

目標：**點變 UI 都郁唔到 utility class**。

```
util/          = 純邏輯層（vanilla JS，零 React / 零 components import）
components/    = 純 UI + useMeeting adapter
server/        = signaling relay
依賴方向         = components → util（單向），util 永不指向 components/React
```

已用 grep 驗證：`util/*` 冇任何 `react` / `components/` import。

## 最終目錄結構

```
src/util/         WebRTC.js、WebRTC-Config.js、Meeting.js、Peer.js、LocalStreamManager.js
src/components/   testHook/Layout.jsx (/l)、testHook2/ UI (/t)、share/panel/ (/)、testSimplePeer/ (/testSimplePeer)
server/           t/、testSimplePeer/、index.js
```

Route 只保留 `/`、`/l`、`/t`、`/testSimplePeer`。

## 做咗啲咩

### 1. WebRTC wrapper 統一
- 統一咗 c / testHook / testHook2 / u 四個版本 → `src/util/WebRTC.js`。
- 用「testHook2 結構」+「u 防守邏輯」合併。特點：
  - class + `#private` 欄位 + JSDoc，11 個事件。
  - `setRemoteDescription` 加 try/catch + state 記錄。
  - `hangUp` 有 `signalingState !== "closed"` 檢查。
  - `addICECandidate` 改 async/await。
  - public `removeAllTracks()`；`send` 有 data channel reopen 邏輯。

### 2. LocalStreamManager 統一成 static 版
- 原本 `util/LocalStreamManager.js` 係 instance API，testHook2 係 static API。
- 統一做 **static**：`LocalStreamManager.getMediaStream(shareVideo, shareAudio)`、
  `getShareDesktopStream(...)`、`closeStream(stream)`。
- `share/panel/Panel.jsx`（`/` route）由 `new LocalStreamManager()` 改成 static 呼叫。

### 3. Logic 搬去 util
- `testHook2` 嘅 `Meeting.js`、`Peer.js`、`LocalStreamManager.js` → 搬去 `src/util/`（canonical）。
- `util/Peer.js` import 改 `./WebRTC`。
- `testHook2/useMeeting.js` 三個 import 指去 `../../util/...`——**UI 只經 useMeeting 掂 util**。

### 4. 刪除（死檔）
- 成個 folder：`src/components/c/`、`src/components/u/`、`server/c/`、`server/b/`。
- `testHook/` 只留 `Layout.js`，其餘死 logic / 死 UI（`Meeting.js`、`Peer.js`、
  `useMeeting.js`、`TestHook.js`、`LocalMedia.*`、`PeerElement.*`、`QK.js`)全部刪。
- `testHook2/` 搬走後三個原檔刪。
- 已刪：`testMeetingBase/`、`testMeeting_2/`（含 `out/`）、`testPureWebRTC/`（client+server）、
  `components/d/`、`components/L.js`。
- `server/index.js` 清走 C / B namespace 同相關註解。
- `src/util/Utility.js` 全 repo 冇人引用，暫時保留未刪。

### 5. UI 組件改 `.jsx`
- 有 JSX 嘅 9 個檔全部改名 `.js` → `.jsx`（`App.jsx`、`Layout.jsx`、`TestHook.jsx`、
  `PeerElement.jsx`、`LocalMedia.jsx`、`Panel.jsx`、`MessageBox.jsx`、`MediaPlayer.jsx`、
  `TestSimplePeer.jsx`）。
- 冇 JSX 嘅 keep `.js`：`util/*`（邏輯層）、`useMeeting.js`（hook）、`SignalServer.js`、
  `testSimplePeer/Peer.js`。
- `index.js`（CRA entry bootstrap）、`App.test.js`（測試）照慣例 keep `.js`。
- 全 repo 冇顯式 `.js` import（全部 extensionless），CRA webpack resolve `.jsx`，所以唔使改 import。

### 6. TURN / STUN 分離
- **STUN（公開）**：留喺 `src/util/WebRTC-Config.js` 硬code（Google 5 隻 `stun[1-4].l.google.com`）。
- **TURN**：改由 `.env` 嘅 `REACT_APP_TURN_SERVERS`（JSON array）提供。
  - `.env.development` / `.env.production` 各有一份。
  - 冇設 / `'[]'` / JSON 錯 → **空陣列（淨 STUN）**，唔再預設任何 TURN。
- 新增 `.env.example` template。
- 補充：`REACT_APP_*` 會 build 入 bundle，**唔算機密**。
  真 TURN 保安應由 server 發 ephemeral credential（HMAC 限時），唔係放 client。

### 測試位置
- `/testSimplePeer` 用自身硬code ICE config（Google STUN + numb.viagenia.ca TURN），冇共用 util config。

## 驗證方式
- `npm run build` → Compiled successfully。
- `node --check server/index.js` → ok。
- 實測 dotenv `JSON.parse` `REACT_APP_TURN_SERVERS` → 3 組 TURN 全部讀到。
- grep 確認 `util/*` 零 React / components import，冇殘留死檔引用。
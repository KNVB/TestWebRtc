# TestWebRtc

WebRTC 視像會議 POC（React 17 + Socket.IO + Express）。多人會議、資料 channel 傳訊、語音辨識（實驗性）。

## 架構

```
src/util/         純邏輯層（vanilla JS，零 React / 零 components import）
src/components/   純 UI + useMeeting adapter（UI 改動唔會掂到 util）
server/           Socket.IO signaling relay
依賴方向           components → util（單向）；util 永不 import React / components
```

詳細重構記錄見 [docs/refactor-notes-2026-09-20.md](docs/refactor-notes-2026-09-20.md)。

## 目錄結構

```
src/
  util/                     WebRTC.js、WebRTC-Config.js、Meeting.js、Peer.js、LocalStreamManager.js
  components/
    share/panel/            Panel.jsx 等（/ 測試場，用 socket.io 演示）
    testHook/               Layout.jsx（/l，純 mockup，VIDEO0101.mp4）
    testHook2/              TestHook.jsx + useMeeting.js（/t，完整多人會議）
                             SpeechRecognition.js（語音→文字，實驗性）
    testSimplePeer/         TestSimplePeer.jsx（/testSimplePeer，SimplePeer P2P）
server/
  index.js                  入口
  t/                        /t 會議 namespace
  testSimplePeer/          SimplePeer signaling
```

## 路由

| 路由 | 內容 |
|---|---|
| `/` | Panel（socket.io 演示） |
| `/l` | Layout mockup |
| `/t` | 完整多人會議（WebRTC + global message + 語音辨識） |
| `/testSimplePeer` | SimplePeer P2P 測試 |

## 設定（.env）

複製 `.env.example` 做 `.env.development` / `.env.production`：

```
REACT_APP_Mode=Development
REACT_APP_SOCKET_PORT=8080
REACT_APP_SOCKET_URL=http://localhost:8080/
REACT_APP_TURN_SERVERS='[{"urls":"turn:...","username":"...","credential":"..."}]'
```

- `REACT_APP_SOCKET_URL` 要指去 Socket.IO server。開發時 client（:3000）同 server（:8080）唔同 port，要開 CORS/ proxy。
- `REACT_APP_TURN_SERVERS` 係 JSON array 嘅 ICE TURN entries；冇設／`'[]'` → 只行 Google STUN，唔用任何 TURN。
- `REACT_APP_*` 會 build 入 client bundle，**唔算機密**；真 TURN 密鑰請用 server 端 ephemeral credential（TURN REST API）。
- STUN（公開）硬code喺 `src/util/WebRTC-Config.js`。

## 開發

```bash
npm run dev      # 同時起 React（:3000）同 Socket.IO server（:8080）
npm run server   # 只起 server
npm run build    # production build（output 落 build/）
```

Production（`npm run prod`）會由 `server/index.js` serve `build/`。

## 已知問題 / 注意

- **語音辨識（`/t`）目前未啟動**：`SpeechRecognition.js` 只係接好咗 `onResult`，冇任何地方 call `start()`，UI 亦冇掣。
- **Web Speech API 只支援 Chrome/Edge/Safari**；Firefox 一直未支援（2026 仲係實驗性，on-device 實作排緊）。Firefox 而家開 `/t` 會喺 join 時 `new SpeechRecognition()` throw error。
- SpeechRecognition 只做辨識，冇翻譯；要翻譯要另外接 Translation API / server。
- `/testSimplePeer` 用自己硬code嘅 ICE config，冇共用 `util/WebRTC-Config.js`。
- `src/util/Utility.js` 暫時冇人引用（未刪）。
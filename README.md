# TestWebRtc

WebRTC video meeting POC (React 17 + Socket.IO + Express). Multi-party meetings, data-channel messaging, speech recognition (experimental).

## Architecture

```
src/util/         Pure logic layer (vanilla JS, zero React / zero components imports)
src/components/   Pure UI + useMeeting adapter (changing the UI never touches util)
server/           Socket.IO signaling relay
Dependency rule   components → util (one-way); util never imports React / components
```

Detailed refactor log: [docs/refactor-notes-2026-09-20.md](docs/refactor-notes-2026-09-20.md).

## Folder structure

```
src/
  util/                     WebRTC.js, WebRTC-Config.js, Meeting.js, Peer.js, LocalStreamManager.js
  components/
    share/panel/            Panel.jsx etc. (/ socket.io demo)
    testHook/               Layout.jsx (/l, pure mockup, VIDEO0101.mp4)
    testHook2/              TestHook.jsx + useMeeting.js (/t, full multiparty meeting)
                             SpeechRecognition.js (speech → text, experimental)
    testSimplePeer/         TestSimplePeer.jsx (/testSimplePeer, SimplePeer P2P)
server/
  index.js                  entry point
  t/                        /t meeting namespace
  testSimplePeer/           SimplePeer signaling
```

## Routes

| Route | Content |
|---|---|
| `/` | Panel (socket.io demo) |
| `/l` | Layout mockup |
| `/t` | Full multiparty meeting (WebRTC + global message + speech recognition) |
| `/testSimplePeer` | SimplePeer P2P test |

## Setup (.env)

Copy `.env.example` to `.env.development` / `.env.production`:

```
REACT_APP_Mode=Development
REACT_APP_SOCKET_PORT=8080
REACT_APP_SOCKET_URL=http://localhost:8080/
REACT_APP_TURN_SERVERS='[{"urls":"turn:...","username":"...","credential":"..."}]'
```

- `REACT_APP_SOCKET_URL` must point to the Socket.IO server. In dev the client (:3000) and server (:8080) run on different ports; make sure the proxy/CORS is in place.
- `REACT_APP_TURN_SERVERS` is a JSON array of ICE TURN entries; if unset / `'[]'`, only Google STUN is used (no TURN).
- `REACT_APP_*` values are bundled into the client build, so they are **not secrets**; for a real TURN server, use server-issued ephemeral credentials (TURN REST API).
- STUN (public) is hardcoded in `src/util/WebRTC-Config.js`.

## Development

```bash
npm run dev      # starts React (:3000) and the Socket.IO server (:8080) together
npm run server   # server only
npm run build    # production build (output in build/)
```

In production (`npm run prod`) `server/index.js` serves the `build/` folder.

## Known issues / notes

- **Speech recognition (`/t`) is not started yet**: `SpeechRecognition.js` only wires up `onResult`, nothing calls `start()`, and the UI has no button.
- **Web Speech API is Chrome/Edge/Safari only**: Firefox has never supported it (still experimental in 2026, on-device implementation in progress). Opening `/t` in Firefox throws in `new SpeechRecognition()` while joining.
- SpeechRecognition only transcribes; it does not translate. To translate, add the Translation API / a server call separately.
- `/testSimplePeer` uses its own hardcoded ICE config; it does not share `util/WebRTC-Config.js`.
- `src/util/Utility.js` is currently unreferenced (not deleted yet).
# Meeting Refactor Notes (2026-09-20)

Record of the consolidation and cleanup done to the TestWebRtc POC in this session.

## Architecture principle

Goal: **changing the UI must never touch the utility classes.**

```
util/          = pure logic layer (vanilla JS, zero React / zero components imports)
components/    = pure UI + useMeeting adapter
server/        = signaling relay
Dependency rule = components → util (one-way); util never points to components/React
```

Verified by grep: `util/*` has no `react` / `components/` imports.

## Final folder structure

```
src/util/         WebRTC.js, WebRTC-Config.js, Meeting.js, Peer.js, LocalStreamManager.js
src/components/   testHook/Layout.jsx (/l), testHook2/ UI (/t), share/panel/ (/), testSimplePeer/ (/testSimplePeer)
server/           t/, testSimplePeer/, index.js
```

Only 4 routes remain: `/`, `/l`, `/t`, `/testSimplePeer`.

## What was done

### 1. Unified WebRTC wrapper
- Merged the c / testHook / testHook2 / u variants into `src/util/WebRTC.js`.
- "testHook2 structure" + "u defensive logic". Highlights:
  - class + `#private` fields + JSDoc, 11 events.
  - `setRemoteDescription` wrapped in try/catch with state logging.
  - `hangUp` guarded by `signalingState !== "closed"`.
  - `addICECandidate` made async/await.
  - public `removeAllTracks()`; `send` reopens the data channel when the connection is up.

### 2. LocalStreamManager unified to the static version
- `util/LocalStreamManager.js` was instance-based, testHook2 was static.
- Unified to **static**: `LocalStreamManager.getMediaStream(shareVideo, shareAudio)`,
  `getShareDesktopStream(...)`, `closeStream(stream)`.
- `share/panel/Panel.jsx` (`/` route) switched from `new LocalStreamManager()` to static calls.

### 3. Logic moved to util
- testHook2's `Meeting.js`, `Peer.js`, `LocalStreamManager.js` moved to `src/util/` (canonical).
- `util/Peer.js` import changed to `./WebRTC`.
- `testHook2/useMeeting.js` imports point to `../../util/...` — **UI reaches util only through useMeeting**.

### 4. Deletions (dead code)
- Entire folders: `src/components/c/`, `src/components/u/`, `server/c/`, `server/b/`.
- `testHook/` keeps only `Layout.js`; deleted the dead logic/UI (`Meeting.js`, `Peer.js`,
  `useMeeting.js`, `TestHook.js`, `LocalMedia.*`, `PeerElement.*`, `QK.js`).
- testHook2 originals removed after the move.
- Also deleted: `testMeetingBase/`, `testMeeting_2/` (incl. `out/`), `testPureWebRTC/` (client+server),
  `components/d/`, `components/L.js`.
- `server/index.js` cleaned up of C / B namespaces and related comments.
- `src/util/Utility.js` is unreferenced across the repo; kept for now, not deleted.

### 5. UI components renamed to `.jsx`
- The 9 files containing JSX were renamed `.js` → `.jsx` (`App.jsx`, `Layout.jsx`, `TestHook.jsx`,
  `PeerElement.jsx`, `LocalMedia.jsx`, `Panel.jsx`, `MessageBox.jsx`, `MediaPlayer.jsx`,
  `TestSimplePeer.jsx`).
- Non-JSX files keep `.js`: `util/*` (logic), `useMeeting.js` (hook), `SignalServer.js`,
  `testSimplePeer/Peer.js`.
- `index.js` (CRA entry bootstrap) and `App.test.js` (test) stay `.js` by convention.
- No import in the repo uses an explicit `.js` extension (all extensionless); CRA webpack resolves
  `.jsx`, so no imports had to change.

### 6. TURN / STUN separation
- **STUN (public)**: stays hardcoded in `src/util/WebRTC-Config.js` (5 Google `stun[1-4].l.google.com`).
- **TURN**: now provided by `REACT_APP_TURN_SERVERS` (JSON array) in `.env`.
  - `.env.development` / `.env.production` each carry a copy.
  - Unset / `'[]'` / invalid JSON → **empty array (STUN only)**, no default TURN anymore.
- Added `.env.example` template.
- Note: `REACT_APP_*` values end up in the bundle, so they are **not secret**.
  Real TURN security should use server-issued ephemeral credentials (HMAC time-limited), not client-side values.

### Test locations
- `/testSimplePeer` uses its own hardcoded ICE config (Google STUN + numb.viagenia.ca TURN); it does not
  share the util config.

## 7. Git sync: merge origin/master (integrate remote changes)

Local was found to be behind remote `origin/master` (diverged at `4d906d8`). A merge was made
(commit `d334ea9`) — **not a lazy merge**, the remote changes were actually integrated:

- **Remote improvements ported into `util/` (canonical)**:
  - `util/LocalStreamManager.js`: `closeStream` changed from async `.forEach(track=>track.stop())` to a
    sync for-loop (fixing the `forEach(async)` un-awaited bug; JSDoc updated to `Promise<MediaStream?>`).
  - `util/WebRTC.js`: added **auto `restartIce()` when ICE state is `"failed"`** in the
    `oniceconnectionstatechange` handler.
  - `util/Peer.js`: git rename-merge automatically brought in the remote formatting fixes
    (indentation / try-catch spacing); logic unchanged.
- **SpeechRecognition (new remote feature) integrated into `/t`**:
  - New file `src/components/testHook2/SpeechRecognition.js` (Web Speech API, `lang: en-US`).
  - `testHook2/useMeeting.js`: `new SpeechRecognition()` + `onResult(sendRecognizedText)`
    → recognized text is sent via `meeting.sendGlobalMessage` (also pulled in the `leaveMeeting`
    peerList guard and the sync `closeStream` calls). Imports kept on the `../../util/...` paths.
  - `old_WebRTC_API.html` (added by remote) kept.
- **Things left untouched / resolved**: the old `testHook2/WebRTC.js`, `Peer.js`,
  `LocalStreamManager.js` copies stay deleted (canonical lives in `util/`); the `useMeeting.js`
  conflict was resolved by hand (util paths + SpeechRecognition import); `package-lock.json` took
  `--theirs` (remote version; package.json unchanged).
- Note: SpeechRecognition is **not actually started yet** (nothing calls `start()`, no UI button),
  and Firefox has never supported Web Speech API (as of 2026 still "coming, not shipped").
- After merge, `npm run build` passed; the `util/*` zero-React/components invariant was intact.

## How it was verified
- `npm run build` → Compiled successfully.
- `node --check server/index.js` → ok.
- Real dotenv test: `JSON.parse(REACT_APP_TURN_SERVERS)` → all 3 TURN servers parsed.
- Grep confirms `util/*` has zero React / components imports and no dangling references to dead files.
- Git: merge commit `d334ea9` pushed; `master` fully in sync with `origin/master`.

## Technical background (findings this session)
- **Web Speech API `SpeechRecognition`**:
  - It does **not** translate; it only transcribes. Translate by hooking up a Translation API /
    server call separately.
  - Firefox has never supported it (Firefox 155+ is implementing on-device recognition via Parakeet
    under `browser.ai.control.speechRecognition`, with a new `available()/install()` flow, but not
    broadly shipped yet).
  - Chrome/Edge recognition runs through their server (needs network).
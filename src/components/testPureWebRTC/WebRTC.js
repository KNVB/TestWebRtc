import io from 'socket.io-client';
class WebRTC {
    constructor(peerName,msLogger) {
        let configuration = {
            iceServers:
                [{ urls: "stun:stun.stunprotocol.org" },
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com" }
                ]
        };
        
    }
}
export default WebRTC;
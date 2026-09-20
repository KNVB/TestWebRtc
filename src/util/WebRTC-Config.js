let stunServers = [
    {
        urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
        ]
    },
];
let turnServers = [];
if (process.env.REACT_APP_TURN_SERVERS) {
    try {
        turnServers = JSON.parse(process.env.REACT_APP_TURN_SERVERS);
        if (!Array.isArray(turnServers) || turnServers.length === 0) {
            console.error("Invalid REACT_APP_TURN_SERVERS: not a non-empty array, fallback to empty.");
            turnServers = [];
        }
    } catch (error) {
        console.error("Invalid REACT_APP_TURN_SERVERS JSON, fallback to empty:", error);
        turnServers = [];
    }
}
const config = {
    iceServers: [...turnServers, ...stunServers],
};
export default config
let config = {
    iceServers: [
        {
            urls: "turn:numb.viagenie.ca",
            credential: "turnserver",
            username: "sj0016092@gmail.com",
        },
        {
            urls: ["turn:openrelay.metered.ca:443?transport=tcp"],
            username: "openrelayproject",
            credential: "openrelayproject",
        },
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun1.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ]
        },
    ]
    /*
    iceServers: [
        { urls: "stun:stun.stunprotocol.org" },
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302"},
        { urls: "stun:stun2.l.google.com:19302"},
        {
            urls: "turn:numb.viagenie.ca",
            credential: "turnserver",
            username: "sj0016092@gmail.com",
        },
    ],
    */
};
export default config
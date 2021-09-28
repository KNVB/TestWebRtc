class TestPureWebRTC{
    constructor(socket){
        console.log("TestPureWebRTC:Connection established");
        socket.on("hangUp",()=>{
            socket.broadcast.emit("hangUp");
        });
        socket.on('sendLocalDescription',data=>{
            console.log('sendLocalDescription');
            socket.broadcast.emit("receiveRemoteDescription",data);
        });
        socket.on("sendICECandidate",data=>{
            console.log("sendICECandidate");
            socket.broadcast.emit("receiveICECandidate",data);
        });
    }    
}
module.exports=TestPureWebRTC;
class TestPureWebRTC{
    constructor(socket){
        console.log("TestPureWebRTC:Connection established");
        socket.on("hangUp",()=>{
            socket.broadcast.emit("hangUp");
        });
        socket.on('sendLocalDescription',data=>{
            socket.broadcast.emit("receiveRemoteDescription",data);
        });
        socket.on("sendICECandidate",data=>{
            socket.broadcast.emit("receiveICECandidate",data);
        });
    }    
}
module.exports=TestPureWebRTC;
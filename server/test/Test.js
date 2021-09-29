class Test{
    constructor(socket){
        console.log("Test:Connection established");
        socket.on('disconnect', function () {
            console.log("Test:Disconnected");
        });
        socket.on("askConnect",peerName=>{
            console.log("Test:"+peerName+" askConnect event received.")
            socket.broadcast.emit("requestConnect",peerName);
        });
        socket.on("hangUp",()=>{
            socket.broadcast.emit("hangUp",{});
        });
        socket.on("sendICECandidate",data=>{
            console.log("Test: receive ICE candidate");
            socket.broadcast.emit("receiveICECandidate",data);
        });
        socket.on('sendLocalDescription',data=>{
            console.log("Test: receive local description");
            socket.broadcast.emit("receiveRemoteDescription",data);
        });
    }    
}
module.exports=Test;
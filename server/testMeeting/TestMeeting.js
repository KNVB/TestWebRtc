class TestMeeting{
    constructor(socket){
        console.log("TestMeeting:Connection established");
        socket.on('disconnect', function () {
            console.log("TestSimplePeer:Disconnected");
        });
        socket.on("newPeer",(peerName)=>{
            console.log("TestMeeting:newPeer event received.")
            socket.broadcast.emit("newPeer", {from:peerName,socketId:socket.id});
        });
        socket.on("sayHi",(sayHi)=>{
            console.log("sayHi event received.");
            socket.to(sayHi.socketId).emit("greeting",{from:sayHi.peerName,socketId:socket.id});
        });
    }
}
module.exports=TestMeeting;
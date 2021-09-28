class TestSimplePeer{
    constructor(socket){
        console.log("TestSimplePeer:Connection established");
        socket.on('disconnect', function () {
            console.log("TestSimplePeer:Disconnected");
        });
        socket.on("newPeer",()=>{
            console.log("TestSimplePeer:newPeer event received.")
            socket.broadcast.emit("newPeer", {});
        });
        socket.on("signalData",(data)=>{
            console.log("TestSimplePeer:signalData received.")
            socket.broadcast.emit("signalData",data);
        });
    }
}
module.exports=TestSimplePeer;
class TestSimplePeer{
    constructor(socket){
        console.log("Connection established");
        socket.on('disconnect', function () {
            console.log("Disconnected");
        });
        socket.on("newPeer",()=>{
            console.log("newPeer event received.")
            socket.broadcast.emit("newPeer", {});
        });
        socket.on("signalData",(data)=>{
            socket.broadcast.emit("signalData",data);
        });
    }
}
module.exports=TestSimplePeer;
class TestPureWebRTC{
    constructor(socket){
        console.log("TestPureWebRTC:Connection established");
        socket.on('disconnect', function () {
            console.log("Test:Disconnected");
        });
        socket.on("askConnect",peerName=>{
            console.log("TestPureWebRTC:"+peerName+" askConnect event received.")
            socket.broadcast.emit("requestConnect",peerName);
        });
        socket.on("hangUp",()=>{
            socket.broadcast.emit("hangUp",{});
        });       
        socket.on("signalData",(data)=>{
            console.log("TestPureWebRTC:signalData received.")
            socket.broadcast.emit("signalData",data);
        });
    }    
}
module.exports=TestPureWebRTC;
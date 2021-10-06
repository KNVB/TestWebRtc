class TestMeeting{
    constructor(){
        let peerList={};
        this.addPeer=(socket)=>{
            socket.on('disconnect', function () {
                console.log("TestSimplePeer:Disconnected");
            });
            socket.on("newPeer",peerName=>{
                peerList[socket.id]={from:peerName,socketId:socket.id};
                socket.broadcast.emit("newPeerAdded", {from:peerName,socketId:socket.id});
            });
            /*
            socket.on("newPeer",(peerName,callBack)=>{
                console.log("TestMeeting:newPeer event received.")
                console.log("before="+JSON.stringify(peerList));
                peerList[socket.id]={from:peerName,socketId:socket.id};
                //socket.broadcast.emit("newPeerAdded", {from:peerName,socketId:socket.id});
                console.log("after="+JSON.stringify(peerList));
                callBack({"peerList":peerList});
            });
            */
            socket.on("sayHi",(sayHi)=>{
                console.log("sayHi to "+sayHi.peerName);
                socket.to(sayHi.socketId).emit("greeting",{from:sayHi.peerName,socketId:socket.id});
            });
        }
    }
}
module.exports=TestMeeting;
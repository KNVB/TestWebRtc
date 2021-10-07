class TestMeeting{
    constructor(){
        let peerList={};
        this.addPeer=(socket)=>{
            socket.on('disconnect', function () {
                let peer=peerList[socket.id];
                console.log("TestSimplePeer:Disconnected");
                if (peer){
                    console.log(peer.name+" leave the meeting.");
                }
                delete peerList[socket.id];
                console.log("==================peer list===============");
                console.log(peerList);
                socket.broadcast.emit("removePeer",socket.id);
            });
            socket.on("hi",(peerName,calllBack)=>{
                peerList[socket.id]={name:peerName,socketId:socket.id};
                console.log("Received say hi from "+peerName+".");
                socket.broadcast.emit("newPeer",peerList[socket.id]);
                console.log("Broadcast newPeer ("+peerName+") to other peer.");
                calllBack({"peerList":peerList})
            })
        }
    }
}
module.exports=TestMeeting;
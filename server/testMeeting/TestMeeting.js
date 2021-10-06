class TestMeeting{
    constructor(){
        let peerList={};
        this.addPeer=(socket)=>{
            socket.on('disconnect', function () {
                delete peerList[socket.id]
                console.log("TestSimplePeer:Disconnected");
                console.log(peerList);
            });
            socket.on("hi",(peerName,calllBack)=>{
                peerList[socket.id]={name:peerName,socketId:socket.id};
                console.log("Received say hi from "+peerName+".");
                socket.broadcast.emit("newPeer",peerList[socket.id]);
                console.log("Broadcast newPeer to other peer.");
                calllBack({"peerList":peerList})
            })
        }
    }
}
module.exports=TestMeeting;
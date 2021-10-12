class TestMeeting{
    constructor(){
        let peerList={};
        this.addPeer=(socket)=>{
            socket.on("askConnect",(param)=>{
                console.log("Received ask Connect event");                
                console.log("==================peer list===============");
                console.log(peerList);
                let source=peerList[param.from];
                let destination=peerList[param.to];
                if ((source) && (destination)){
                    console.log(source.name+" request to make connection with "+destination.name);
                    socket.broadcast.to(param.to).emit('requestConnect', peerList[param.from] );
                }
            });
            socket.on('disconnect', function () {
                let peer=peerList[socket.id];
                console.log("TestMeeting:Disconnected");
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
            socket.on("signalData",param=>{
                let source=peerList[socket.id];
                let destination=peerList[param.to];
                if ((source) && (destination)){
                    console.log(source.name+" sent signal data to "+destination.name);
                    socket.broadcast.to(param.to).emit('signalData', {from:socket.id,signalData:param.signalData});
                }
            });
        }
    }
}
module.exports=TestMeeting;
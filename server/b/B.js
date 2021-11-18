class B{
    constructor(){
        let peerList={};
        this.addPeer=(socket)=>{
            socket.on('disconnect', ()=>{
                let peerId;
                Object.keys(peerList).forEach(key=>{
                    let peer=peerList[key];
                    if (peer.socketId === socket.id){
                        peerId=key;
                        console.log("Peer ("+peer.name+"):Disconnected");
                        delete peerList[key];                        
                    }
                });                
                console.log("==================peer list===============");
                console.log(peerList);
                socket.broadcast.emit("removePeer",peerId);
            });
            socket.on("hi",(peerName,calllBack)=>{
                let peerId=generateUID();
                peerList[peerId]={name:peerName,socketId:socket.id};
                console.log("Received say hi from "+peerName+".");
                socket.broadcast.emit("newPeer",{peerId:peerId,...peerList[peerId]});
                console.log("Broadcast newPeer ("+peerName+") to other peer.");
                calllBack({peerId:peerId,"peerList":peerList});
                console.log("==================peer list===============");
                console.log(peerList);
            });
            socket.on("refreshSocketId",peerId=>{
                console.log("Refresh socket Id:"+peerId);
                let peer=peerList[peerId];
                console.log(peerList[peerId]);
                //peerList[peerId].socketId=socket.id;
            });
        }
        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        let generateUID=()=>{
            // I generate the UID from two parts here 
            // to ensure the random number provide enough bits.
            let firstPart = (Math.random() * 46656) | 0;
            let secondPart = (Math.random() * 46656) | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
    }
}
module.exports=B;
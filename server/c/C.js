class C {
    constructor(io, path) {
        let peerList = {};
        let timeOut = 60; // in sec
        let finalTimeOut = timeOut * 1000;        

        setInterval(() => {
            let now = new Date().getTime();
            let removePeerIdList = [];
            for (const [peerId, peer] of Object.entries(peerList)) {
                if (peer.disconnectTime) {
                    let diff = now - peer.disconnectTime.getTime();
                    if (diff >= finalTimeOut) {
                        console.log("Peer (" + peer.name + ") connection time out.");
                        removePeerIdList.push(peerId);
                    }
                }
            }            
            if (removePeerIdList.length>0){
                removePeerNow(removePeerIdList);
            }            
        }, finalTimeOut);

        io.of(path).on("connection", socket => {
            console.log("Connection to Class C is established.");
            socket.on("hi", (peerName, calllBack) => {
                let peerId = generateUID();
                peerList[peerId] = { peerName: peerName, socketId: socket.id }
                console.log("==================Receive Hi Event Start===============");
                console.log("from:" + peerName);
                socket.broadcast.emit("askConnect", { peerId: peerId, peerName: peerName });
                calllBack({ peerId: peerId, "peerList": peerList });
                console.log("==================peer list===============");
                console.log(peerList);
                console.log("==================Receive Hi Event End===============");
            });
            socket.on("reconnectRequest", peer => {
                console.log("==================Receive reconnectRequest Event Start==============="); 
                console.log("Receive reconnect Event from " + peer.peerName);
                console.log("peerid="+peer.peerId);               
                peerList[peer.peerId].socketId=socket.id;
                peerList[peer.peerId].disconnectTime=null;
                console.log("==================peer list===============");
                console.log(peerList);
                socket.broadcast.emit("askReconnect", peer.peerId);               
                console.log("==================Receive reconnectRequest Event End==============="); 
            });
            socket.on('disconnect', (reason) => {
                console.log("==================Receive Disconnect Event Start===============");
                console.log("socket.id="+socket.id);
                let removePeer=null,removePeerId = null;
                for (const [peerId, peer] of Object.entries(peerList)) {
                    if (peer.socketId === socket.id) {
                        removePeer = peer;
                        removePeerId=peerId;
                        break;
                    }
                }
                if (removePeer){
                    console.log("peer:"+removePeer.peerName);
                    if (reason === "client namespace disconnect") {               
                        removePeerNow([removePeerId]);
                    } else {
                        peerList[removePeerId].disconnectTime=new Date();
                    }
                }
                /*
                console.log("==================peer list===============");
                console.log(peerList);
                */
                console.log("==================Receive Disconnect Event End===============");
            });
        });

        /*=======================================================*/
        /*      Private Method                                   */
        /*=======================================================*/
        let generateUID = () => {
            // I generate the UID from two parts here 
            // to ensure the random number provide enough bits.
            let firstPart = (Math.random() * 46656) | 0;
            let secondPart = (Math.random() * 46656) | 0;
            firstPart = ("000" + firstPart.toString(36)).slice(-3);
            secondPart = ("000" + secondPart.toString(36)).slice(-3);
            return firstPart + secondPart;
        }
        let removePeerNow=(removePeerIdList)=>{
            console.log("==================peer list before remove the disconnected peer===============");
            console.log(peerList);
            removePeerIdList.forEach(peerId => {
                console.log("Peer (" + peerList[peerId].peerName + ") leave the meeting.")
                delete peerList[peerId];
            });
            console.log("==================peer list after remove the disconnected peer===============");
            console.log(peerList);
            io.of(path).emit("removePeerIdList", removePeerIdList);            
        }
    }
}
module.exports = C;
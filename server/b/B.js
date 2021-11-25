class B {
    constructor(io) {
        let peerList = {};
        let timeOut = 60; // in sec
        setInterval(() => {
            let disconnectedPeerIdList = [];
            let now = new Date().getTime();
            let finalTimeOut=timeOut*1000;
            Object.keys(peerList).forEach(peerId => {
                let peer = peerList[peerId];
                if (peer.socketId === null){
                    if ((now - peer.disconnectTime) > finalTimeOut) {
                        console.log("Peer (" + peer.name + "): connection time out.");
                        delete peerList[peerId];
                        disconnectedPeerIdList.push(peerId);
                        console.log("==================peer list===============");
                        console.log(peerList);
                    }
                }
            });
            if (disconnectedPeerIdList.length > 0) {
                io.of("/b").emit("disconnectedPeerIdList", disconnectedPeerIdList);
                //console.log(io.of("/b"))
            }
        }, timeOut * 1000);
        this.register = (socket) => {
            socket.on('disconnect', (reason) => {
                Object.keys(peerList).forEach(peerId => {
                    let peer = peerList[peerId];
                    if (peer.socketId === socket.id) {
                        console.log("Peer (" + peer.name + "):Disconnected");
                        console.log("reason= " + reason);
                        if (reason === "client namespace disconnect"){
                            delete peerList[peerId];
                            io.of("/b").emit("disconnectedPeerIdList",[peerId]);
                        }else {
                            peerList[peerId].disconnectTime = new Date();
                            peerList[peerId].socketId = null;
                        }
                    }
                });
                console.log("==================peer list===============");
                console.log(peerList);
            });
            socket.on("hi", (peerName, calllBack) => {
                let peerId = generateUID();
                peerList[peerId] = { disconnectTime: null, name: peerName, socketId: socket.id };
                console.log("Received say hi from " + peerName + ".");
                socket.broadcast.emit("newPeer", { "peerId": peerId, name: peerName });
                calllBack({ peerId: peerId, "peerList": peerList });
                console.log("==================peer list===============");
                console.log(peerList);
            });
            socket.on("refreshSocketId", (peerId, calllBack) => {
                if (peerList[peerId]) {
                    console.log("Peer (" + peerList[peerId].name + "): refresh socket id.");
                    peerList[peerId].socketId = socket.id;
                    peerList[peerId].disconnectTime = null;
                    socket.broadcast.emit("peerReconnect", peerId);
                    calllBack({ peerId: peerId, result:true});
                } else {
                    calllBack({ peerId: peerId, result:false, message:"Connection time out,please login again"});
                }
            })
        }
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
    }
}
module.exports = B;
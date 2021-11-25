class B {
    constructor(io, path) {
        let peerList = {};
        let timeOut = 30; // in sec
        let finalTimeOut = timeOut * 1000;
        setInterval(() => {
            let now = new Date().getTime();
            let removePeerIdList = [];
            for (const [peerId, peer] of Object.entries(peerList)) {
                if (peer.socketId === null) {
                    let diff = now - peer.disconnectTime.getTime();
                    if (diff > finalTimeOut) {
                        console.log("Peer (" + peer.name + ") connection time out.");
                        removePeerIdList.push(peerId);
                    }
                }
            }
            removePeerNow(removePeerIdList);
        }, finalTimeOut);
        io.of(path).on("connection", socket => {
            console.log("B(" + socket.id + "):Connection established");

            socket.on('disconnect', (reason) => {
                let removePeerId = null;
                for (const [peerId, peer] of Object.entries(peerList)) {
                    if (peer.socketId === socket.id) {
                        removePeerId = peerId;
                        break;
                    }
                }
                if (removePeerId) {
                    if (reason === "client namespace disconnect") {
                        removePeerNow([removePeerId]);
                    } else {
                        peerList[removePeerId].disconnectTime = new Date();
                        peerList[removePeerId].socketId = null;
                    }
                }
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
        })

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
        let removePeerNow = (peerIdList) => {
            peerIdList.forEach(peerId => {
                console.log("Peer (" + peerList[peerId].name + ") leave the meeting.")
                delete peerList[peerId];
            });
            if (peerIdList.length > 0) {
                console.log("==================peer list===============");
                console.log(peerList);
                io.of(path).emit("removePeerIdList", peerIdList);
            }
        }
    }
}
module.exports = B;
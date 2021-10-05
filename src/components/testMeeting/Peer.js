class Peer {
    constructor(remotePeerName,remoteSocketId) {
        let peerName=remotePeerName;
        let socketId=remoteSocketId;

        this.peerName=()=>{return peerName}
        this.socketId=()=>{return socketId}
    }
}
export default Peer;        
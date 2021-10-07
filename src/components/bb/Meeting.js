export default class Meeting{
    constructor(){
        this.peerList={};
        this.addPeer=(newPeer)=>{
            this.peerList[newPeer.socketId] = newPeer;
        }
        this.removePeer=(socketId)=>{
            delete this.peerList[socketId]
        }
    }
}
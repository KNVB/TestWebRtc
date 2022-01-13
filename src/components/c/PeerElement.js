export default function PeerElement({peer}){
    return (
        <div className="border border-dark m-1 p-1 rounded-3">
            Peer Name:{peer.peerName}<br/>
            Status:{}
        </div>
    )
}
import { forwardRef, useImperativeHandle,useState } from "react";
import PeerElement from "./PeerElement";
const PeerList = forwardRef((props, ref) => {
  const [peerList, setPeerList] = useState({});
  useImperativeHandle(ref, () => ({
    addPeer: (peer) => {
      let temp = { ...peerList };
      temp[peer.socketId] ={"element":<PeerElement key={peer.socketId} peerObj={peer} ref={peerRef=>temp[peer.socketId].ref=peerRef}/>};
      setPeerList(temp);
    },
    removePeer: (socketId) => {
      let temp = { ...peerList };
      delete temp[socketId];      
      setPeerList(temp);
    },
    setPeerList: (newPeerList) => {
      let temp = {};
      Object.keys(newPeerList).forEach((socketId) => {
        temp[socketId]={"element": <PeerElement key={socketId} peerObj={newPeerList[socketId]} ref={peerRef=>temp[socketId].ref=peerRef}/>}
      });
      setPeerList(temp);
    },
    setRemoteStream: (stream, peer) => {
      //console.log(peerList.ref[peer.socketId]);
      peerList[peer.socketId].ref.setStream(stream);
    },
  }));
  let peerComponentList = [];
  Object.keys(peerList).forEach((key) => {
    peerComponentList.push(peerList[key].element);
  });
  return (
    <>
      {peerComponentList}
    </>
  );
});
export default PeerList;

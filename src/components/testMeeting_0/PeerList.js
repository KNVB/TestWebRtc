import { forwardRef, useImperativeHandle,useState } from "react";
import Peer from "./Peer";
const PeerList = forwardRef((props, ref) => {
  const [peerList, setPeerList] = useState({ref:{},element:{}});
  useImperativeHandle(ref, () => ({
    addPeer: (peer) => {
      let temp = { ...peerList };
      temp.element[peer.socketId] = <Peer key={peer.socketId} peerObj={peer} ref={peerRef=>temp.ref[peer.socketId]=peerRef}/>;
      setPeerList(temp);
    },
    removePeer: (socketId) => {
      let temp = { ...peerList };
      delete temp.element[socketId];
      delete temp.ref[socketId];
      setPeerList(temp);
    },
    setPeerList: (newPeerList) => {
      let temp = {ref:{},element:{}};
      Object.keys(newPeerList).forEach((socketId) => {
        temp.element[socketId] = (
          <Peer key={socketId} peerObj={newPeerList[socketId]} ref={peerRef=>temp.ref[socketId]=peerRef}/>
        );
      });
      setPeerList(temp);
    },
    setRemoteStream: (stream, peer) => {
      //console.log(peerList.ref[peer.socketId]);
      peerList.ref[peer.socketId].setStream(stream);
    },
  }));
  let peerComponentList = [];
  Object.keys(peerList.element).forEach((key) => {
    peerComponentList.push(peerList.element[key]);
  });
  return <div>{peerComponentList}</div>;
});
export default PeerList;

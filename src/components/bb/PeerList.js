import { forwardRef, useImperativeHandle, useState } from "react";
const PeerList = forwardRef((props, ref) => {
  const [peerList, setPeerList] = useState({});
  useImperativeHandle(ref, () => ({
    addPeer: (peer) => {
      let temp = { ...peerList };
      temp[peer.socketId] = peer;
      setPeerList(temp);
    },
    removePeer: (socketId) => {
      let temp = { ...peerList };
      delete temp[socketId];
      setPeerList(temp);
    },
    setPeerList: (newPeerList) => {
      setPeerList(newPeerList);
    },
  }));
  return (
    <div>
      {Object.keys(peerList).map((key, index) => (
        <div key={index}>{peerList[key].name}</div>
      ))}
    </div>
  );
});
export default PeerList;

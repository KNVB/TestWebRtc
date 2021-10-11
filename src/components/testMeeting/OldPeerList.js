import { forwardRef, useImperativeHandle, useState } from "react";
import Peer from './Peer';
const OldPeerList = forwardRef((props, ref) => {
  const [peerList, setPeerList] = useState({});
  useImperativeHandle(ref, () => ({
    addPeer: (peer) => {
      let temp = { ...peerList };
      temp[peer.socketId] =<Peer key={peer.socketId} peerObj={peer}/>
      setPeerList(temp);
    },
    removePeer: (socketId) => {
      let temp = { ...peerList };
      delete temp[socketId];
      setPeerList(temp);
    },
    setPeerList: (newPeerList) => {
      let temp={};
      Object.keys(newPeerList).forEach(socketId=>{
        temp[socketId]=<Peer key={socketId} peerObj={newPeerList[socketId]}/>
      })
      setPeerList(temp);
    },
    setStream:(stream,peer)=>{
      peerList[peer.socketId].setStream(stream);
    }
  }));
  let peerComponentList=[];
  Object.keys(peerList).forEach(key=> {
    peerComponentList.push(peerList[key]);
  });  
  return (
    <div>
      {peerComponentList}
    </div>
  );
});
export default OldPeerList;

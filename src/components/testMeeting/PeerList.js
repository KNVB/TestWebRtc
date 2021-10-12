import Peer from './Peer'
export default function PeerList({ peerList }) {
  let result=[];
  console.log(peerList);
  if (peerList){
    Object.keys(peerList).forEach(key=>{
      //console.log(peerList[key]);
      result.push(<Peer key={key} peerObj={peerList[key]}/>)
    })
  }
  return (
    <>
      {result}
    </>
  )
}

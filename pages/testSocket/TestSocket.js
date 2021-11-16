import { useEffect, useReducer} from "react";
import LocalStreamManager from "../../util/LocalStreamManager";
import Meeting from "./Meeting";
import PeerElement from "./PeerElement";
export default function TestSocket(){
    let localStreamManager = new LocalStreamManager();
    
    useEffect(()=>{
		let peerName;
		let sUsrAg = navigator.userAgent;
		if (sUsrAg.indexOf("Edg") > -1) {
		  peerName = "Edge";
		} else {
		  if (sUsrAg.indexOf("Chrome") > -1) {
			peerName = "Chrome";
		  } else {
			if (sUsrAg.indexOf("Firefox") > -1) {
			  peerName = "Firefox";
			} else {
			  if (sUsrAg.indexOf("Safari") > -1) {
				peerName = "Safari";
			  }
			}
		  }
		}
        let webSocketServerURL=process.env.REACT_APP_SOCKET_URL + "a";
        let meeting=new Meeting();
        //meeting.setWebRTCConfig();
        meeting.setWebSocketServerURL(webSocketServerURL);
        meeting.setDebug(true);
        meeting.on("newPeer",peer=>{
            console.log("newPeer event occured.");
            console.log("New Peer name:"+peer.name);
            peer.isCall = true;
            updatePeerList({type:"newPeer","newPeer":peer});
        });
        meeting.on("setPeerList",initialPeerList=>{
            console.log("setPeerList event occured.");
            updatePeerList({type:"setPeerList","meeting":meeting,"peerList":initialPeerList});
        });
        meeting.on("removePeer",socketId=>{
            console.log("removePeer event occured.");
            updatePeerList({type:"removePeer","socketId":socketId});
        });
        meeting.connect();
        meeting.join(peerName);
    },[]);
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type){
            case "newPeer":
                result.peerList[action.newPeer.socketId]=action.newPeer;
                break;
            case "removePeer":
                delete result.peerList[action.socketId];
                break;
            case "setPeerList":
                result.peerList={...action.peerList};
                result.meeting=action.meeting;
                break;                
            default:
                break;
        }
        return result;
    }
       
    const [items, updatePeerList] = useReducer(reducer, {});
    let go = async () => {
      let localStream;
      try {
        localStream = await localStreamManager.getMediaStream(true, false);
      } catch (error) {
        console.log("Getting local media failure:" + error.message);
        localStream = null;
      } finally {
        items.meeting.setLocalStream(localStream);
      }
    }; 
    let peerElementList = [];
    if (items.peerList) {
      Object.keys(items.peerList).forEach(socketId => {
        peerElementList.push(<PeerElement key={socketId} peer={items.peerList[socketId]} meeting={items.meeting} />);
      })
    }
    return (
        <>
          {peerElementList}
          <button onClick={go}>Share Video</button>
        </>
    )
}
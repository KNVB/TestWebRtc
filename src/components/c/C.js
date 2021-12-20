import {useEffect,useReducer} from "react";
import Meeting from "./Meeting";
export default function C(){
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
        let meeting=new Meeting(peerName);
        updateItemList({type:"init","meeting":meeting});
    },[]);
    let reducer = (state, action) => {
        let result = { ...state };
        switch (action.type){
            case "init":
                result.peerName=action.peerName;
                result.meeting=action.meeting;
            default:
                break;
        }
        return result;
    }
    const [itemList, updateItemList] = useReducer(reducer, {});
    let connect=()=>{
        itemList.meeting.connect();       
    }
    let disconnect=()=>{
        itemList.meeting.disconnect();
    }
    return (
        <div>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
        </div>
    )
}
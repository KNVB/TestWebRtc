import { useEffect,useReducer } from "react";
import LocalStreamManager from "../common/LocslStreamManager";
import Peer from "../common/Peer";
import "./TestWebRTC.css";
import config from "../common/WebRTC-Config";
let initPeer=(peerName:string,updater:any)=>{
    let peer=new Peer();
    peer.on("signal",(signal:object)=>{
        updater({name:peer.peerName,type:"signal"});
    });
    peer.peerName=peerName;
    peer.setConfig(config);
    peer.init();
    return peer;
}
let reducer=(state:any,action:any):any=>{
    let result={...state};
    switch (action.type){
        case "init":
            console.log("init");
            result.caller=initPeer("caller",action.updater);
            break
        case "signal":
            console.log(action.name+" signal");
            break;    
        default:
            break
    }
    return result;
}
export default function TestWebRTC1() {
    const[itemList,updateItemList]=useReducer(reducer,{});
    useEffect(()=>{             
        updateItemList({type:"init",updater:updateItemList})
    },[]);
    let go=()=>{
        itemList.caller.call();
    }
    return (
        <div>
            <button onClick={go}>Go</button>
        </div>
    )
}

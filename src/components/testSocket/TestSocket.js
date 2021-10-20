import { useEffect,useReducer } from 'react';
import io from 'socket.io-client';
import Peer from './Peer';
import PeerElement from './PeerElement';
export default function TestSocket(){
    
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
    useEffect(()=>{
        let socket = io(process.env.REACT_APP_SOCKET_URL+"a", { transports: ['websocket'] });
        setItem({type:"init",param:{peerList:{},socket:socket}});

        socket.emit("hi",peerName,response=>{
            let tempPeerList={};
            console.log(response.peerList);
            Object.keys(response.peerList).forEach(key=>{
                let peer=new Peer(response.peerList[key].name,key);
                peer.on("signal",signalEventHandler);
                tempPeerList[key]={obj:peer,call:false,"socket":socket};
            })
            setItem({type:"setPeerList",peerList:tempPeerList})
        });
        socket.on("newPeer",newPeer=>{
            let peer=new Peer(newPeer.name,newPeer.socketId);
            peer.on("signal",signalEventHandler);
            setItem({type:"newPeer","newPeer":peer});
            //socket.emit("askConnect",{from:socket.id,to:newPeer.socketId});
        });
        socket.on("removePeer",socketId=>{
            setItem({type:"removePeer","socketId":socketId})
        });
        socket.on("receiveSignalData",param=>{
            //items.peerList[param.from].obj.signal(param.signalData);
            console.log("signal event recevied:");
            setItem({type:"receiveSignalData","param":param});
        });
        let signalEventHandler=signalEvent=>{
            console.log("signal event is sent.");
            //console.log(signalEvent);
            socket.emit("sendSignalData",signalEvent);
        }        
    },[peerName]);    
    let reducer=(state,action)=>{
        let result={...state};
        switch (action.type){
            case "init":
                result=action.param;
                break;
            case "newPeer":
                result.peerList[action.newPeer.socketId]={obj:action.newPeer,call:true};
                break;
            case "removePeer":
                delete result.peerList[action.socketId];
                break;
            case "receiveSignalData":
                //console.log(result.peerList[action.param.from]);
                result.peerList[action.param.from].signalData=(action.param.signalData);               
                break;
            case "setPeerList":
                result.peerList={...action.peerList};
                break;    
            default:
                break;
        }
        return result;
    }
    let peerElementList=[];
    const[items,setItem]=useReducer(reducer,{});
    //console.log(items.peerList);
    if (items.peerList){
        Object.keys(items.peerList).forEach(key=>{
            if (items.peerList[key].signalData){
                peerElementList.push(<PeerElement call={items.peerList[key].call} key={key} peerObj={items.peerList[key].obj} signalData={items.peerList[key].signalData}/>);
            }else {
                peerElementList.push(<PeerElement call={items.peerList[key].call} key={key} peerObj={items.peerList[key].obj} />);
            }
        })
    }
    return (
        <>
            {peerElementList}      
        </>
    )
}
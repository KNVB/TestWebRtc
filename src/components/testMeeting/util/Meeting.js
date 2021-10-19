import io from "socket.io-client";
import Peer from './Peer';
export default class Meeting{
    constructor(){
        let dataEventHandler,initialPeerListEventHandler;
        let newPeerEventHandler,removePeerEventHandler,streamEventHandler;
        let isDebug=false,localStream=null;
        let peerList={};
        let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "testMeeting", {
            transports: ["websocket"],
        });
/*=====================================================================*/
/*        To handler for varies socket event                           */
/*=====================================================================*/
        socket.on("newPeer", peer => {
            msgLogger("new peer event received.");
            socket.emit("askConnect",{from:socket.id,to:peer.socketId});
            let newPeer=initPeer(peer);            
            peerList[peer.socketId]=newPeer;
            newPeer.call();
            if (newPeerEventHandler){
                newPeerEventHandler(newPeer);
            }
        });
        socket.on("removePeer", (socketId) => {
            msgLogger("remove peer event received.");
            if (peerList[socketId]){
                peerList[socketId].hangUp();
                delete peerList[socketId];
            }
            if (removePeerEventHandler){
                removePeerEventHandler(socketId);
            }
        });
        socket.on('requestConnect',(remotePeer)=>{
            msgLogger("Received connect request from "+remotePeer.name+".");
            let newPeer=initPeer(remotePeer);            
            peerList[remotePeer.socketId]=newPeer;            
        });
        socket.on("signalData",async (param)=>{
            msgLogger("Rececived signal Data from "+peerList[param.from].name);
            peerList[param.from].signal(param.signalData);
        });
/*=====================================================================*/
/*        To join the meeting                                          */
/*=====================================================================*/
        this.join=(peerName)=>{
            socket.emit("hi", peerName, (response) => {
                msgLogger("Say hi to peer.");
                peerList={};
                Object.keys(response.peerList).forEach(socketId=>{
                    let peer=response.peerList[socketId];
                    peerList[socketId]=initPeer(peer);
                })
                if (initialPeerListEventHandler){
                    initialPeerListEventHandler(peerList);
                }
            });
        }
/*=====================================================================*/
/*        To configure handler for varies event                        */
/*=====================================================================*/
        this.on=(eventType,handler)=>{
            switch (eventType){
                case "data":
                    dataEventHandler=handler;
                    break;
                case "initialPeerList":
                    initialPeerListEventHandler=handler;
                    break;
                case "newPeer":
                    newPeerEventHandler=handler;
                    break;
                case "removePeer":
                    removePeerEventHandler=handler;
                    break;
                case "stream":    
                    streamEventHandler=handler;
                    break;
                default:
                    break    
            }
        }
/*=====================================================================*/
/*        To control if message error is shown                         */
/*=====================================================================*/
        this.setDebug=(debug)=>{
            isDebug=debug;
        }
/*=====================================================================*/
/*       The local stream setter                                       */
/*=====================================================================*/        
        this.setLocalStream=(stream)=>{
            localStream=stream;
            setLocalStream(stream);
        }
//==============================================================================================================
//      Private function
/*=====================================================================*/
/*        To initialize a Peer object                                  */
/*=====================================================================*/
        let initPeer=(peer)=>{
            let newPeer=new Peer(peer.name,peer.socketId);
            
            if (localStream){
                newPeer.setStream(localStream);
            }
            newPeer.on("signal",param=>{
                socket.emit("signalData",param);
            });
            newPeer.on("data",param=>{
                if (dataEventHandler){
                    dataEventHandler(param);
                }
            });
            newPeer.on("stream",param=>{
                msgLogger("A stream event from "+peer.name+" received.");
                //console.log(param);
                streamEventHandler(param);
            })
            newPeer.init();
            return newPeer;
        }
/*=====================================================================*/
/*        To send the local stream all remote peer                     */
/*=====================================================================*/
        let setLocalStream=(stream)=>{
            msgLogger("set Stream::"+JSON.stringify(peerList));
            Object.keys(peerList).forEach(key=>{
                msgLogger("Setting stream to "+peerList[key].name);
                peerList[key].setStream(stream);
                //msgLogger(peerList[key]);
            })
        }
/*=====================================================================*/
/*        Message Logger                                               */
/*=====================================================================*/
        let msgLogger=(msg)=>{
            if (isDebug){
                console.log(msg);
            }
        }        
    }
}
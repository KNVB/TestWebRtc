export default class MyPeer{
    constructor(peerName){
        let configuration = {
            iceServers: [
              { urls: "stun:stun.stunprotocol.org" },
              { urls: "stun:stun.l.google.com:19302" },
              {
                urls: "turn:numb.viagenie.ca",
                credential: "turnserver",
                username: "sj0016092@gmail.com",
              },
            ],
          };
        let dataChannel = null, dataChannelCloseHandler = null;
        let dataChannelOpenHandler = null,ignoreOffer = false;
        let isDebug=false,makingOffer = false;        
        let peerConnection = null, polite = false;
        let signalEventHandler=null;
        this.call=()=>{
          polite = true;
          dataChannel = peerConnection.createDataChannel("chat");
          dataChannel.onopen = dataChannelOpen;
          dataChannel.onmessage = dataChannelMessage;
          dataChannel.onclose = dataChannelClose;
          dataChannel.onerror = dataChannelError;
        }
        this.hangUp=()=>{
          hangUp();
        }
        this.init=()=>{
          msgLogger(
            "peerConnection is" + (peerConnection ? " not " : " ") + "null"
          );
          msgLogger("polite="+polite);
          peerConnection = new RTCPeerConnection(configuration);
          peerConnection.ondatachannel = dataChannelEventHandler;
          peerConnection.onicecandidate = iceCandidateEventHandler;
          peerConnection.onnegotiationneeded = handleNegotiation;
          peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
          peerConnection.onsignalingstatechange = signalingStateChangeHandler;
        }
        this.on=(eventType,param)=>{
          switch (eventType){
            case "connect":
              dataChannelOpenHandler =param;
              break;
            case "signal":
              signalEventHandler=param;
              break;
            default:break;  
          }
        }  
        this.setDebug=(debug)=>{
          isDebug=debug;
        }
        this.signal=async (signalData)=>{
          await processSignalData(signalData);
        }
//======================================================================
        let dataChannelEventHandler=(event)=>{
          msgLogger(peerName + " Data channel is created!");
          event.channel.onopen = dataChannelOpen;
          event.channel.onmessage = dataChannelMessage;
          event.channel.onclose = dataChannelClose;
          event.channel.onerror = dataChannelError;
          dataChannel = event.channel;
        }
        let dataChannelClose=(event)=>{
          msgLogger(peerName + " Data Connection close");
          msgLogger("dataChannel is " + (dataChannel ? "not" : "") + " null");
          if (dataChannel) {
            msgLogger("dataChannel.readyState=" + dataChannel.readyState);
            dataChannel = null;
          }

          msgLogger("peerConnection is " + (peerConnection ? "not" : "") + " null");

          if (peerConnection) {
            peerConnection.close();
            msgLogger(
              "peerConnection.signalingState=" + peerConnection.signalingState
            );
            peerConnection = null;
          }
          ignoreOffer = false;
          makingOffer = false;
          polite=false;
          if (dataChannelCloseHandler) {
            dataChannelCloseHandler();
          }
        }
        let dataChannelError=(event)=>{
          msgLogger(peerName + " Data channel error:" + event.error.message);
        }
        let dataChannelMessage=(message)=>{
          msgLogger(
            peerName + " Received Message from Data Channel:" + message.data
          );
        }
        let dataChannelOpen=(event)=>{
          msgLogger(peerName + " Data Channel Open");
          if (dataChannelOpenHandler) {
            dataChannelOpenHandler();
          }
        }                
//======================================================================
        let handleNegotiation=async (event)=>{
          try {
            msgLogger(peerName + " Handle Negotiation");
            makingOffer = true;
            await peerConnection.setLocalDescription();
            signalEventHandler(peerConnection.localDescription);
            msgLogger(peerName + " Sent local Description");
          } catch (err) {
            msgLogger("Failed to send Local Description:"+err);
          } finally {
            makingOffer = false;
          }
        }
        let hangUp=()=>{ 
          peerConnection.close();
        }
        let iceCandidateEventHandler=(event)=>{
          if (event.candidate == null) {
            msgLogger(peerName + " All ICE candidates are sent");
          } else {
            signalEventHandler(event.candidate);
          }
        }
        let iceConnectionStateChangeHandler=(event)=>{
          msgLogger(
            peerName +
              " ICE Connection State Changed to:" +
              peerConnection.iceConnectionState
          );
          switch (peerConnection.iceConnectionState) {
            case "failed":
              msgLogger(peerName + " restart ICE");
              ignoreOffer = false;
              makingOffer = false;
              peerConnection.restartIce();
              break;
            default:
              break;
          }        
        }  
        let msgLogger=(msg)=>{
          if (isDebug){
            console.log(msg);
          }
        }
        let processSignalData=async (signalData)=>{
          //console.log(signalData);

          if (signalData.type){
            if (signalData.type === "offer"){
              console.log(peerName+" receive Remote Description");
              const offerCollision = (signalData.type === "offer") &&
                            (makingOffer || peerConnection.signalingState !== "stable");
              ignoreOffer = !polite && offerCollision;
              if (ignoreOffer) {
                console.log(peerName+" ignore offer");
                return;
              }
              await peerConnection.setRemoteDescription(signalData);
              msgLogger(peerName + " Set Remote Description");

              await peerConnection.setLocalDescription();
              signalEventHandler(peerConnection.localDescription);
              msgLogger(peerName + " Sent local Description");
            } else {
              await peerConnection.setRemoteDescription(signalData);
              msgLogger(peerName + " Set Remote Description");
            }
          }else {
            if (signalData.candidate){
              console.log(peerName+" receive ICE Candidate");
              await peerConnection.addIceCandidate(signalData);
            }
          }
        }
        let signalingStateChangeHandler=(event)=>{
          msgLogger(
            peerName + " Signaling State change to " + peerConnection.signalingState
          );
        }        
    }
}
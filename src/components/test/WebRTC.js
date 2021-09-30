import io from "socket.io-client";
class WebRTC {
  constructor(peerName) {
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
    let dataChannelOpenHandler = null, ignoreOffer = false;
    let isLocalDescOk=false,isRemoteDescOk=false;
    let makingOffer = false, msgLogger;
    let peerConnection = null, polite = false;
    let socket = io.connect(process.env.REACT_APP_SOCKET_URL + "test", {
      transports: ["websocket"],
    });
    socket.on("requestConnect", (remotePeerName) => {
      console.log(
        peerName + " received request connect event from " + remotePeerName
      );
      init();
    });
    this.call = () => {
      polite = true;
      socket.emit("askConnect", peerName);
      init();
      dataChannel = peerConnection.createDataChannel("chat");
      dataChannel.onopen = dataChannelOpen;
      dataChannel.onmessage = dataChannelMessage;
      dataChannel.onclose = dataChannelClose;
      dataChannel.onerror = dataChannelError;
    };
    this.hangUp = () => {
      //socket.emit("hangUp");
      hangUp();
    };
    this.setDataChannelCloseHandler = (handler) => {
      dataChannelCloseHandler = handler;
    };
    this.setDataChannelOpenHandler = (handler) => {
      dataChannelOpenHandler = handler;
    };
    this.setMsgLogger = (logger) => {
      msgLogger = logger;
    };
    //=================================================================================================
    function dataChannelEventHandler(event) {
      msgLogger(peerName + " Data channel is created!");
      event.channel.onopen = dataChannelOpen;
      event.channel.onmessage = dataChannelMessage;
      event.channel.onclose = dataChannelClose;
      event.channel.onerror = dataChannelError;
      dataChannel = event.channel;
    }
    function dataChannelClose(event) {
      msgLogger(peerName + " Data Connection close");
      if (dataChannelCloseHandler) {
        dataChannelCloseHandler();
      }
      /*
            event.target.onopen = null;
            event.target.onmessage = null;
            event.target.onclose = null;
            event.target.onerror = null;
            */

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
      isLocalDescOk=false;
      isRemoteDescOk=false;
      makingOffer = false;
      polite=false;      
      /*
            if (dataChannel){
                dataChannel.onopen = null;
                dataChannel.onmessage = null;
                dataChannel.onclose = null;
                dataChannel.onerror = null;
                dataChannel=null;
            }
            if (peerConnection){
                peerConnection.onicecandidate = null;
                peerConnection.onnegotiationneeded = null;
                peerConnection.oniceconnectionstatechange = null;
                peerConnection.onsignalingstatechange=null;
                peerConnection.close();
                peerConnection=null;
            }
*/
    }
    function dataChannelError(event) {
      msgLogger(peerName + " Data channel error:" + event.error.message);
    }
    function dataChannelMessage(message) {
      msgLogger(
        peerName + " Received Message from Data Channel:" + message.data
      );
    }
    function dataChannelOpen(event) {
      msgLogger(peerName + " Data Channel Open");
      if (dataChannelOpenHandler) {
        dataChannelOpenHandler();
      }
    }
    //=======================================================================================================
    async function handleNegotiation() {
      try {
        msgLogger(peerName + " Handle Negotiation");
        makingOffer = true;
        await peerConnection.setLocalDescription();
        isLocalDescOk =true;
        msgLogger(peerName + " Send Local Description");
        socket.emit("sendLocalDescription", peerConnection.localDescription);
      } catch (err) {
        msgLogger("Failed to send Local Description:"+err);
      } finally {
        makingOffer = false;
      }
    }
    function hangUp() {      
      /*
            if (dataChannel){
                msgLogger(peerName+" close data channel.");
                dataChannel.close();
                //dataChannel=null;
            }
            */
      /*
            peerConnection.onicecandidate = null;
            peerConnection.onnegotiationneeded = null;
            peerConnection.oniceconnectionstatechange = null;
            peerConnection.onsignalingstatechange=null;
            */            
      peerConnection.close();
      //peerConnection=null;
    }
    function iceCandidateEventHandler(event) {
      if (event.candidate == null) {
        msgLogger(peerName + " All ICE candidates are sent");
      } else {
        msgLogger(peerName + " An ICE candidate is sent.");
        socket.emit("sendICECandidate", event.candidate);
      }
    }
    function iceConnectionStateChangeHandler(event) {
      msgLogger(
        peerName +
          " ICE Connection State Changed to:" +
          peerConnection.iceConnectionState
      );
      switch (peerConnection.iceConnectionState) {
        case "disconnected":
          msgLogger("dataChannel is " + (dataChannel ? "not" : "") + " null");
          msgLogger(
            "peerConnection is " + (peerConnection ? "not" : "") + " null"
          );

          /*
                    if (dataChannel){
                        dataChannel.close();
                        dataChannel=null;
                    }*/
          if (peerConnection) {
            /* 
                        peerConnection.onicecandidate = null;
                        peerConnection.onnegotiationneeded = null;
                        peerConnection.oniceconnectionstatechange = null;
                        peerConnection.onsignalingstatechange=null;
                        
                        peerConnection.close();
                        msgLogger(peerName+" calls peerConnection.close()");
                     */
            msgLogger(
              "peerConnection.signalingState=" + peerConnection.signalingState
            );
            peerConnection = null;
          }
          break;
        case "failed":
          msgLogger(peerName + " restart ICE");
          peerConnection.restartIce();
          break;
        default:
          break;
      }
    }
    async function init() {
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
      socket.on("hangUp", async () => {
        msgLogger(peerName + " receive hang up event.");
        hangUp();
      });
      socket.on("receiveICECandidate", async (iceCandidate) => {
        msgLogger(peerName + " receiveICECandidate");
        if (peerConnection) {
          await peerConnection.addIceCandidate(iceCandidate);
        }
      });
      socket.on("receiveRemoteDescription", async (remoteDescription) => {
        msgLogger(peerName + " receive remote description");
        if (peerConnection) {
          try {
            const offerCollision =
              remoteDescription.type === "offer" &&
              (makingOffer || peerConnection.signalingState !== "stable");
            ignoreOffer = !polite && offerCollision;
            if (ignoreOffer) {
              return;
            }
            msgLogger(
              peerName +
                " ICE Connection State Changed to:" +
                peerConnection.iceConnectionState
            );
            if (isRemoteDescOk === false){
              await peerConnection.setRemoteDescription(remoteDescription);
              isRemoteDescOk=true;
            }
            if ((isLocalDescOk === false) && (remoteDescription.type === "offer")) {
              await peerConnection.setLocalDescription();
              msgLogger(peerName + " Send Local Description");
              socket.emit(
                "sendLocalDescription",
                peerConnection.localDescription
              );
            }
          } catch (error) {
            msgLogger("Failed to set remot description:" + error.message);
            msgLogger(
              peerName +
                " ICE Connection State Changed to:" +
                peerConnection.iceConnectionState
            );
          }
        }
      });

      msgLogger(peerName + " init()");
    }
    function signalingStateChangeHandler(event) {
      msgLogger(
        peerName + " Signaling State change to " + peerConnection.signalingState
      );
    }
    //=======================================================================================================
  }
}
export default WebRTC;

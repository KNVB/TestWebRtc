export default class WebRTC {
  constructor(peerName) {
    let configuration = {};
    let dataChannel = null, dataHandler = null;
    let dataChannelOpenHandler = null, dataChannelCloseHandler = null;
    let iceStateChangeEventHandler=null,ignoreOffer = false, isDebug = false;
    let localStream = null, makingOffer = false;
    let peerConnection = null, polite = false;
    let signalEventHandler = null, signalingStateChangeEventHandler=null,trackHandler = null;
    /*=====================================================================*/
    /*        To set up a connection                                       */
    /*=====================================================================*/
    this.call = () => {
      polite = true;
      dataChannel = peerConnection.createDataChannel("chat");
      dataChannel.onopen = dataChannelOpen;
      dataChannel.onmessage = dataChannelMessage;
      dataChannel.onclose = dataChannelClose;
      dataChannel.onerror = dataChannelError;
    }
    /*=====================================================================*/
    /*        Get the connection state                                     */
    /*=====================================================================*/    
    this.getConnectionState=()=>{
      if (peerConnection){
        return peerConnection.iceConnectionState;
      }else {
        return null;
      }      
    };
    /*=====================================================================*/
    /*        To hangup the connection                                     */
    /*=====================================================================*/
    this.hangUp = () => {
      hangUp();
    }
    /*=====================================================================*/
    /*        To initialize the RTCPeerConnection object                   */
    /*=====================================================================*/
    this.init = () => {
      msgLogger(
        "peerConnection is" + (peerConnection ? " not " : " ") + "null"
      );
      peerConnection = new RTCPeerConnection(configuration);
      peerConnection.ondatachannel = dataChannelEventHandler;
      peerConnection.onicecandidate = iceCandidateEventHandler;
      peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
      peerConnection.onicegatheringstatechange = iceGatheringStateChangeHandler;
      peerConnection.onnegotiationneeded = handleNegotiation;

      peerConnection.onsignalingstatechange = signalingStateChangeHandler;
      peerConnection.ontrack = trackEventHandler;
    }
    /*=====================================================================*/
    /*        To configure handler for varies event                        */
    /*=====================================================================*/
    this.on = (eventType, param) => {
      switch (eventType) {
        case "close":
          dataChannelCloseHandler = param;
          break;
        case "connect":
          dataChannelOpenHandler = param;
          break;
        case "data":
          dataHandler = param;
          break;
        case "iceStateChange":
          iceStateChangeEventHandler=param;
          break  
        case "signal":
          signalEventHandler = param;
          break;
        case "signalingStateChange":
          signalingStateChangeEventHandler=param; 
          break;
        case "stream":
          trackHandler = param;
          break;
        default: break;
      }
    }
    /*=====================================================================*/
    /*        Restart ICE                                                  */
    /*=====================================================================*/
    this.restartICE=()=>{
      if (peerConnection){
        msgLogger("WebRTC:restart ice.")
        peerConnection.restartIce();
      }      
    }
    /*=====================================================================*/
    /*        Set the Configuration                                        */
    /*=====================================================================*/
    this.setConfig=(config)=>{
      configuration = {...config};
    }    
    /*=====================================================================*/
    /*        To control if message error is shown                         */
    /*=====================================================================*/
    this.setDebug = (debug) => {
      isDebug = debug;
    }
    /*=====================================================================*/
    /*       The local stream setter                                       */
    /*=====================================================================*/
    this.setStream = (stream) => {
      msgLogger("peerConnection is " + (peerConnection ? "not" : "") + " null");
      if (peerConnection) {
        setStream(stream);
      } else {
        localStream = stream;
      }
    }
    /*=====================================================================*/
    /*       Send data to remote peer                                      */
    /*=====================================================================*/
    this.send = (data) => {
      if (dataChannel) {
        dataChannel.send(data);
      } else {
        throw new Error("The Data Channel is not available.");
      }
    }
    /*=====================================================================*/
    /*       Send Signal data to remote peer via signaling server          */
    /*=====================================================================*/
    this.signal = async (signalData) => {
      await processSignalData(signalData);
    }
    /*=====================================================================*/
    /*        Data Channel related event handler                           */
    /*=====================================================================*/
    let dataChannelEventHandler = (event) => {
      msgLogger(" Data channel to " + peerName + " is created!");
      event.channel.onclose = dataChannelClose;
      event.channel.onerror = dataChannelError;
      event.channel.onmessage = dataChannelMessage;
      event.channel.onopen = dataChannelOpen;
      dataChannel = event.channel;
    }
    let dataChannelClose = (event) => {
      msgLogger("dataChannel is " + (dataChannel ? "not" : "") + " null");
      if (dataChannel) {
        msgLogger("dataChannel.readyState=" + dataChannel.readyState);
        dataChannel = null;
      }
      if (dataChannelCloseHandler) {
        dataChannelCloseHandler();
      }
    }
    let dataChannelError = (event) => {
      msgLogger(peerName + " Data channel error:" + event.error.message);
    }
    let dataChannelMessage = (message) => {
      if (dataHandler) {
        dataHandler(message.data);
      }
    }
    let dataChannelOpen = (event) => {
      if (localStream) {
        msgLogger("Add local stream to " + peerName + ".");
        setStream(localStream);
      }
      if (dataChannelOpenHandler) {
        dataChannelOpenHandler();
      }
    }
    /*=====================================================================*/
    /*        Handle Negotiation                                           */
    /*=====================================================================*/
    let handleNegotiation = async (event) => {
      try {
        msgLogger("Handle Negotiation with " + peerName);
        makingOffer = true;
        await peerConnection.setLocalDescription();
        signalEventHandler(peerConnection.localDescription);
        msgLogger("Sent local Description to " + peerName);
      } catch (err) {
        msgLogger("Failed to send Local Description:" + err);
      } finally {
        makingOffer = false;
      }
    }
    /*=====================================================================*/
    /*        Hang Up                                                      */
    /*=====================================================================*/
    let hangUp = () => {
      if (peerConnection) {
        peerConnection.getSenders().forEach(sender => {
          peerConnection.removeTrack(sender);
        });
        msgLogger("peerConnection is " + (peerConnection ? "not" : "") + " null");
        if (peerConnection) {
          peerConnection.close();
          msgLogger(
            "peerConnection.signalingState=" + peerConnection.signalingState
          );
          msgLogger(
            peerName +
            " ICE Connection State Changed to:" +
            peerConnection.iceConnectionState
          );
          //peerConnection = null;
        }
        ignoreOffer = false;
        makingOffer = false;
        polite = false;
  
        /*
        if (dataChannel) {
          dataChannel.close();
        }
        */
      }
    }
    /*=====================================================================*/
    /*        ICE related event handler                                    */
    /*=====================================================================*/
    let iceCandidateEventHandler = (event) => {
      if (event.candidate == null) {
        msgLogger("All ICE candidates are sent to " + peerName);
      } else {
        signalEventHandler(event.candidate);
      }
    }
    let iceConnectionStateChangeHandler = (event) => {
      msgLogger(
        peerName +
        " ICE Connection State Changed to:" +
        peerConnection.iceConnectionState
      );
      if (iceStateChangeEventHandler){
        iceStateChangeEventHandler(peerConnection.iceConnectionState);
      }
      /*
      switch (peerConnection.iceConnectionState) {
        case "failed":
          msgLogger(peerName + " restart ICE");
          ignoreOffer = false;
          makingOffer = false;
          peerConnection.restartIce();
          break;
        default:
          break;
      }*/
    }
    let iceGatheringStateChangeHandler = (event) => {
      msgLogger(
        peerName +
        " ICE Garthering State Changed to:" +
        peerConnection.iceGatheringState
      );
    }
    /*=====================================================================*/
    /*        Message Logger                                               */
    /*=====================================================================*/
    let msgLogger = (msg) => {
      if (isDebug) {
        console.log(msg);
      }
    }
    /*=====================================================================*/
    /*        Send the signal data to signal server                        */
    /*=====================================================================*/
    let processSignalData = async (signalData) => {
      if (signalData.type) {
        msgLogger("Receive Remote Description from " + peerName);
        const offerCollision = (signalData.type === "offer") &&
          (makingOffer || peerConnection.signalingState !== "stable");

        ignoreOffer = !polite && offerCollision;
        msgLogger("ignoreOffer = " + ignoreOffer + ",offerCollision=" + offerCollision + ",polite=" + polite);
        if (ignoreOffer) {
          msgLogger("Ignore offer from "+ peerName);
          return;
        }
        await peerConnection.setRemoteDescription(signalData);
        msgLogger("Set Remote Description for " + peerName);

        if (signalData.type === "offer") {
          await peerConnection.setLocalDescription();
          signalEventHandler(peerConnection.localDescription);
          msgLogger("Sent local Description to " + peerName);
        }
      } else {
        if (signalData.candidate) {
          msgLogger("Receive ICE Candidate " + peerName);
          await peerConnection.addIceCandidate(signalData);
        }
      }
    }
    /*=====================================================================*/
    /*        Set a stream to a RTCPeerConnection                          */
    /*=====================================================================*/
    let setStream = (stream) => {
      if (peerConnection) {
        let senders = peerConnection.getSenders();
        senders.forEach(sender => {
          peerConnection.removeTrack(sender);
        })
        if (stream) {
          for (const track of stream.getTracks()) {
            peerConnection.addTrack(track, stream);
          }
        }
      } else {
        localStream = stream;
      }
    }
    /*=====================================================================*/
    /*        Signaling State change event handler                         */
    /*=====================================================================*/
    let signalingStateChangeHandler = (event) => {
      msgLogger(
        peerName + " Signaling State change to " + peerConnection.signalingState
      );
      if (signalingStateChangeEventHandler){
        signalingStateChangeEventHandler(peerConnection.signalingState);
      }
    }
    /*=====================================================================*/
    /*        Track event handler                                          */
    /*=====================================================================*/
    let trackEventHandler = event => {
      msgLogger(
        peerName + " recive a track event"
      );
      //msgLogger(event);

      if (trackHandler) {
        trackHandler(event.streams[0]);
      }
    }
  }
}
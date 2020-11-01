import io from 'socket.io-client';
class WebRTC{
    constructor(){
        var configuration = {iceServers: 
            [{urls: "stun:stun.stunprotocol.org"},
             {urls: "stun:stun.l.google.com:19302"},
             {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"}		
            ]};
        var connectionCloseHandlder=null;    
        var dataChannel=null;
        var dataChannelOpenHandler=null;
        var isHangUpByUser=false,eventMsgLogger=null;
        var peerConnection=null;
        var resetRemoteStreamHandler=null;
        var socket=io.connect("http://localhost:9000");
        var trackEventHandler=null;
        
        this.call=async()=>{
            await peerConnection.createOffer({
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
              })
            .then (async offer=>{
                await peerConnection.setLocalDescription(offer)
                .then(()=>{
                    socket.emit("sendOffer",offer);
                })
                .catch (error=>{
                    throw error;
                })
            })
            .catch (reason=>{
                throw new Error(reason);
            })
        }
        this.hangUp=()=>{
            hangUp();
        }
        this.init=()=>{
            initObject();
        }
        this.setConnectionCloseHandlder=(handler)=>{
            connectionCloseHandlder=handler;
        }
        this.setDataChannelOpenHandler=(handler)=>{
            dataChannelOpenHandler=handler;
        }
        this.setMsgLogger=logger=>{
            eventMsgLogger=logger;
        }
        this.setResetRemoteStreamHandler=(handler)=>{
            resetRemoteStreamHandler=handler;
        }
        this.setTrackEventHandler=handler=>{
            trackEventHandler=handler;
        }
        this.updateStream=(stream)=>{
            var senders=peerConnection.getSenders();
            senders.forEach((sender)=>{
                if (sender.track)
                    sender.track.stop();
            });
            if (stream){
                if (senders.length<1){
                    stream.getTracks().forEach((track)=>{
						eventMsgLogger("0 add "+track.kind+" track");
						peerConnection.addTrack(track,stream);
					});
                } else {
                    stream.getTracks().forEach((track)=>{
						var sender = peerConnection.getSenders().find(function(s) {
							if (s.track)
								return s.track.kind === track.kind;
							else 
								return null;
						});
						if (sender===undefined) {
							eventMsgLogger("1 add "+track.kind+" track");
							peerConnection.addTrack(track,stream);
						} else {
							eventMsgLogger("Replace "+track.kind+" track");
							sender.replaceTrack(track);
						}
					});
                }
            }
        }
/*========================================================================================================*/				
/*        private method                                                                                  */ 
/*========================================================================================================*/			
        function connectionStateChangeHandler(event){

        }
        function dataChannelClose() {
            console.log(`Connection close is request by user=${isHangUpByUser}`);
            if (isHangUpByUser){
                eventMsgLogger('Data channel closed');
                dataChannel.onopen = null;
                dataChannel.onmessage = null;
                dataChannel.onclose = null;
                dataChannel.onerror = null;
                dataChannel=null;
                isHangUpByUser=false;
                socket.disconnect();
                connectionCloseHandlder();
            }		
        }
        function dataChannelError(event) {
			eventMsgLogger('Data channel error:'+event.message);
        }
        function dataChannelMessage(message) {
			eventMsgLogger('Received Message from Data Channel:'+message.data);
		}
        function dataEventMsgLogger(event){
            eventMsgLogger('Data channel Object is created!');
			event.channel.onopen = dataChannelOpenHandler;
			event.channel.onmessage = dataChannelMessage;
			event.channel.onclose = dataChannelClose;
			event.channel.onerror = dataChannelError;
        }
        function iceCandidateEventHandler(event){
            if (event.candidate===null){
                eventMsgLogger("All ICE Candidates are sent");
			} else {
                eventMsgLogger("Send an ICE Candidate");
                socket.emit("sendICECandidate", event.candidate);				
			}
        }
        function iceConnectionStateChangeHandler(event){

        }
        function iceGatheringStateChangeHandler(event){

        }
        function negotiationEventHandler(event){

        }
        function signalingStateChangeHandler(event){

        }
        function hangUp(){
            isHangUpByUser=true;
            socket.emit("hangUp");
        }
        function initObject(){
            peerConnection=new RTCPeerConnection(configuration);
            peerConnection.ontrack=trackEventHandler;
            peerConnection.onconnectionstatechange = connectionStateChangeHandler;
            peerConnection.ondatachannel = dataEventMsgLogger;           
            peerConnection.onicecandidate=iceCandidateEventHandler;
            peerConnection.oniceconnectionstatechange = iceConnectionStateChangeHandler;
            peerConnection.onicegatheringstatechange =iceGatheringStateChangeHandler;
            peerConnection.onnegotiationneeded=negotiationEventHandler;
            peerConnection.onsignalingstatechange=signalingStateChangeHandler;
            
            dataChannel= peerConnection.createDataChannel('chat');
            eventMsgLogger("Connection object created");
        }
/*===================================================================================================*/
/*       Socket related function                                                                     */
/*===================================================================================================*/
        socket.on("hangUp",()=>{
            isHangUpByUser=true;
            peerConnection.close();
        })
        socket.on('receiveAnswer',answer=>{
            eventMsgLogger("Receive an answer"); 
            if (peerConnection.remoteDescription===null){
                peerConnection.setRemoteDescription(answer);
            }
        });
        socket.on('receiveICECandidate',iceCandidate=>{
            eventMsgLogger("Receive an ICE Candidate");
            peerConnection.addIceCandidate(iceCandidate);
        });
        socket.on('receiveOffer',async (offer)=>{
            eventMsgLogger("Receive an offer");
            await peerConnection.setRemoteDescription(offer)
            .then(async()=>{
                await peerConnection.createAnswer()
                .then(async answer=>{
                    await peerConnection.setLocalDescription(answer)
                    .then(()=>{
                        socket.emit("sendAnswer",answer);
                        eventMsgLogger("Send an answer");
                    })
                    .catch (error=>{
                        throw error;
                    })
                })
                .catch(error=>{
                    throw error;
                })
            })
            .catch(error=>{
                throw error
            })
        });
    }
}
export default WebRTC;
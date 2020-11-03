import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
class Peer{
    constructor(){
        var configuration = {iceServers: 
            [{urls: "stun:stun.stunprotocol.org"},
             {urls: "stun:stun.l.google.com:19302"},
             {urls: "turn:numb.viagenie.ca", credential: "turnserver", username: "sj0016092@gmail.com"}		
            ]};
        var connectionCloseHandler=null;    
        var localStream=null;    
        var peer=null;
        var receiveRemoteStreamHandler,resetRemoteStreamHandler;;
        var socket=io.connect("http://localhost:9000"); 
        this.call=()=>{
            console.log("Peer.call is called");
            if (localStream)
                peer=new SimplePeer({config:configuration,stream:localStream})
            else
                peer=new SimplePeer({config:configuration})
            socket.emit("newPeer");
            handle(peer)
        }
        this.setConnectionCloseHandler=(handler)=>{
            connectionCloseHandler=handler;
        }
        this.hangUp=()=>{
            hangUp();
        }
        this.setReceiveRemoteStreamHandler=(handler)=>{
            receiveRemoteStreamHandler=handler
        }
        this.setResetRemoteStreamHandler=(handler)=>{
            resetRemoteStreamHandler=handler;
        }
        this.updateStream=(stream)=>{
            if (peer){
                if (localStream){
                    peer.removeStream(localStream);
                    localStream.getTracks().forEach(track=>{
                        track.stop();
                    })
                }
                localStream=stream;
                if (localStream){
                    peer.addStream(localStream);
                } else {
                    socket.emit("receiveRemoteStream");
                }
            } else {
                localStream=stream;
            }
        }
/*========================================================================================================*/				
/*        private method                                                                                  */ 
/*========================================================================================================*/	        
        function handle(peer){
            peer.on('close', () => {
                console.log("Connection closed.");
                hangUp();
                connectionCloseHandler();
            })
            peer.on('connect', () => {
                console.log("Connection established.");
            });
            peer.on('error', (err) => {
                console.log(err);
            })
            peer.on('signal',data=>{
                console.log("signal Event");
                socket.emit("signalData",data);
            })
            peer.on('stream', stream => {
                console.log("rececive remote stream");
                console.log(`This remote stream ${stream.getTracks().length} track`);
                receiveRemoteStreamHandler(stream);
            })
        }
        function hangUp(){
            peer.destroy();
            peer=null;
            if (socket){
                socket.disconnect();
                socket.destroy();
                socket=null;
            }
            
        }
/*===================================================================================================*/
/*       Socket related function                                                                     */
/*===================================================================================================*/
        socket.on("newPeer",()=>{
            console.log("Receive newPeer event");
            if (localStream)
                peer=new SimplePeer(
                                    {
                                        config:configuration,
                                        initiator:true,stream:localStream
                                    })
            else
                peer=new SimplePeer(
                    {
                        config:configuration,
                        initiator:true,
                    }
                )
            handle(peer);
        });
        socket.on("receiveRemoteStream",()=>{
            resetRemoteStreamHandler();
        });
        socket.on("signalData",data=>{
            console.log("Receive Signal Data");
            peer.signal(data);
        });
    }
}
export default Peer;
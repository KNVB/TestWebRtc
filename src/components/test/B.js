import io from 'socket.io-client';
export default function B(){
    let peerName;
    let sUsrAg = navigator.userAgent;
    let socket = io.connect(process.env.REACT_APP_SOCKET_URL+"test", { transports: ['websocket'] });
    socket.on("requestConnect",(remotePeerName)=>{
        console.log('Received request connect event from '+remotePeerName);
    })
    if (sUsrAg.indexOf("Chrome")>-1){
        peerName="Chrome";
    }else {
        peerName="Firefox";
    }
    let go=()=>{
        socket.emit('askConnect',peerName);
    }
    return(
        <button onClick={go}>Go</button>
    ); 
}
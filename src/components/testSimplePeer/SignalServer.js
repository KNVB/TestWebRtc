import SimplePeer from 'simple-peer';
import io from 'socket.io-client';
class SignalServer{
    constructor(){
        let socket;
        socket = io.connect("http://localhost:" + process.env.REACT_APP_SOCKET_PORT+"/testSimplePeer", { transports: ['websocket'] });
    }
}
export default SignalServer;
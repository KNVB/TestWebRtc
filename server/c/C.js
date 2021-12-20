class C {
    constructor(io, path) {
        io.of(path).on("connection", socket => {
            console.log("Connection to Class C is established.");
            /*
            socket.on("askConnect",()=>{
                console.log("ask connect event recevied.");
                //socket.broadcast.emit("askConnect"); 
            });
            */
            socket.on("hi",peerName=>{
                console.log("Receive Hi Event from "+peerName);
                socket.broadcast.emit("askConnect",peerName);
            });
            socket.on("reconnectRequest",peerName=>{
                console.log("Receive reconnect Event from "+peerName);
                socket.broadcast.emit("askReconnect",peerName);
            });          
            socket.on('disconnect', (reason) => {
                console.log("Disconnected:("+reason+")");
            });
        });
    }
}
module.exports = C;
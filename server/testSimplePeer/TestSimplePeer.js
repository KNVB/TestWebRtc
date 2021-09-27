class TestSimplePeer{
    constructor(socket){
        console.log("Connection established");
        socket.on('disconnect', function () {
            console.log("Disconnected");
        });
    }
}
module.exports=TestSimplePeer;
import $ from 'jquery';
import React,{Component } from 'react';
import LocalStreamManager from './LocalStreamManager';
import Peer from './Peer';
import './TestWebRtc.css';
class TestSimplePeer extends Component {
    constructor(props){
        super(props);
       
        this.localMedia=React.createRef();
        this.peer=null;
        this.remoteMedia=React.createRef();
        this.shareAudio=React.createRef();
        this.shareVideo=React.createRef();
        this.status=React.createRef();
        
        this.call=async()=>{
            this.peer.call();
        }
        this.connectionCloseHandler=()=>{
            console.log("Connection closed");
            this.peer=null;
            this.localStreamManager.closeMedia(this.localMedia.current.srcObject);
          
            this.localMedia.current.srcObject=null;
            this.localStreamManager.closeMedia(this.remoteMedia.current.srcObject);
            this.remoteMedia.current.srcObject=null;            
            this.shareAudio.current.selectedIndex=0;
            this.shareVideo.current.selectedIndex=0;  
            this.initPeer();          
        }
        this.receiveRemoteStreamHandler=(stream)=>{
            console.log("Remote Stream received.");
            console.log(`This remote stream has ${stream.getTracks().length} track`);
            console.log(this.remoteMedia.current.srcObject);
            this.remoteMedia.current.srcObject=stream;
            /*
            if (this.remoteMedia.current.srcObject===null){
                this.remoteMedia.current.srcObject=new MediaStream();  
                stream.getTracks().forEach(track=>{
                    this.remoteMedia.current.srcObject.addTrack(track);
                    console.log(track.kind+",enable="+track.enabled);
                    console.log(track.kind+" track is added.");
                })
            }else {
                if (stream.getAudidoTracks().length>0){
                    if (this.remoteMedia.current.srcObject.getAudidoTracks().length>0){
                        var oldAudioTrack=this.remoteMedia.current.srcObject.getAudidoTracks()[0];
                        
                    } else {
                        this.remoteMedia.current.srcObject.addTrack(stream.getAudidoTracks()[0]);
                    }
                }
            }
            */
        }
        this.resetRemoteStreamHandler=()=>{
            console.log("Receive reset remote stream event");
            this.localStreamManager.closeMedia(this.remoteMedia.current.srcObject);
            this.remoteMedia.current.srcObject=null;
        };
        this.hangUp=()=>{
            this.peer.hangUp();
        }
        this.initPeer=()=>{
            this.peer=new Peer();
            this.peer.setConnectionCloseHandler(this.connectionCloseHandler);
            this.peer.setResetRemoteStreamHandler(this.resetRemoteStreamHandler);
            this.peer.setReceiveRemoteStreamHandler(this.receiveRemoteStreamHandler);
        }
        this.updateSrc=async()=>{
            var shareAudio=(($(this.shareAudio.current).val()==="yes")?true:false);
            var shareVideo=(($(this.shareVideo.current).val()==="yes")?true:false);
            await this.localStreamManager.getMediaStream(shareVideo,shareAudio) 
            .then(stream=>{
                this.localMedia.current.srcObject=stream;
            })
            .catch(error=>{
                console.log(error.message);
                this.localStreamManager.closeMedia(this.localMedia.current.srcObject);                
                this.localMedia.current.srcObject=null;                
            })
            .finally(()=>{
                console.log("this.localMedia is "+((this.localMedia.current.srcObject===null)?"":"not")+" null.");
                this.peer.updateStream(this.localMedia.current.srcObject);
            })
        }
    }
    componentDidMount(){
        document.getElementById("root").classList.add("p-1");
        this.initPeer();
        this.localStreamManager=new LocalStreamManager();
    }
    componentWillUnmount(){
        document.getElementById("root").classList.remove("p-1");
    }
    render() {
        return(
            <div className="border-top border-primary container-fluid d-flex flex-column">
                <div className="row">
                    <div className="border-left border-bottom border-primary col-6 h4 p-1 mb-0">
                        Self View
                    </div>
                    <div className="border-left border-bottom border-right border-primary col-6 h4 p-1 mb-0">
                        Remote View
                    </div>
                </div>	
                <div className="row">
                    <div className="border-left border-bottom border-primary 
                                d-flex flex-grow-1 col-6 p-1 position-relative"
                                style={{"height":"25vh"}}>
                        <video 
                            autoPlay={true}
                            controls
                            ref={this.localMedia}
                            muted/>
                    </div>
                    <div className="border-left border-bottom border-primary 
                            d-flex flex-grow-1 col-6 p-1 position-relative"
                            style={{"height":"25vh"}}>
                        <video 
                            autoPlay={true}
                            controls
                            ref={this.remoteMedia}
                            muted/>    
                    </div>
                </div>
                <div className="row">
                    <div className="align-items-center border-left border-bottom border-right border-primary col-12 d-flex flex-row justify-content-center p-0">
                        <div className="btn-group-toggle d-flex justify-content-center p-1">
                            <button className="btn-sm btn btn-lg btn-success" onClick={this.call}>Make A Call</button>
                        </div>
                    
                        <div className="btn-group-toggle d-flex justify-content-center p-1">
                            <button className="btn-sm btn btn-lg btn-success" onClick={this.clearLog}>Clear Log</button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="align-items-center border-left border-bottom border-right border-primary col-12 d-flex flex-row justify-content-center p-0">
                        <div className="btn-group-toggle p-1">
                            <label className="btn-sm btn btn-lg btn-success">
                                Share 
                                <select name="videoSrc" ref={this.shareVideo} className="bg-success text-white" onChange={this.updateSrc}>
                                    <option value="no" >No</option>
                                    <option value="yes">Yes</option>
                                </select>
                                Video
                            </label>
                        </div>
                        <div className="btn-group-toggle p-1">
                            <label className="btn-sm btn btn-lg btn-success">
                                Share Audio
                                <select name="shareAudio" ref={this.shareAudio} className="bg-success text-white" onChange={this.updateSrc}>
                                    <option value="no" >No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </label>
                        </div>				
                    </div>
                </div>
                <div className="row">
                    <div className="align-items-center border-left border-bottom border-right border-primary col-12 d-flex flex-row justify-content-center p-0">
                        <div className="btn-group-toggle d-flex justify-content-center p-1">
                            <button className="btn-sm btn btn-lg btn-success" onClick={this.hangUp}>Hangup</button>
                        </div>
                        <div className="btn-group-toggle d-flex justify-content-center p-1">
                            <button className="btn-sm btn btn-lg btn-success" onClick={this.copyLog}>Copy log to clipboard</button>
                        </div>
                        <div className="btn-group-toggle d-flex justify-content-center p-1">
                            <button className="btn btn-lg btn-sm btn-danger">
                                Connection status:&nbsp;<span ref={this.status}>closed</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="position-relative row" style={{"height":"20vh"}}>
                    <div className="border-bottom border-left border-primary border-right  
                                col-12 d-flex flex-column h-100 overflow-auto position-absolute p-0" 
                        ref={this.logger}>
                    </div>
                </div>
            </div>
        )
    }
}
export default TestSimplePeer;
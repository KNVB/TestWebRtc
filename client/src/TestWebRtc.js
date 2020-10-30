import React, { Component } from 'react';
import WebRTC from './WebRTC';
class TestWebRtc extends Component {
    constructor(props){
        super(props);
        this.webRTC=new this.webRTC();
        this.localMedia=React.createRef();
        this.remoteMedia=React.createRef();

        this.msgLogger=(msg)=>{
            console.log(msg);
        }
        this.updateSrc=()=>{
            
        }
    }
    componentDidMount(){
        document.getElementById("root").classList.add("p-1");
        this.webRTC.setMsgLogger(this.msgLogger);
        this.updateSrc();
    }
    componentWillUnmount(){
        document.getElementById("root").classList.remove("p-1");
    }
    render() {
        return (<div className="border-top border-primary container-fluid d-flex flex-column">
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
                        col-6 p-1"
                        style={{"height":"25vh"}}>
                <video 
                    autoPlay
                    ref={this.localMedia}
                    muted/>
            </div>
            <div className="border-left border-bottom border-primary 
                    border-right col-6 p-1"
                    style={{"height":"25vh"}}>
                <video 
                    autoPlay
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
    </div>)
    }
}
export default TestWebRtc
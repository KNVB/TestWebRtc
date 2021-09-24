import $ from 'jquery';
import LocalStreamManager from './LocalStreamManager';
import React,{Component } from 'react';
import ReactPlayer from 'react-player';
class TestReactPeer extends Component {
    constructor(props){
        super(props);
        this.reactPlayer=React.createRef();
        this.shareAudio=React.createRef();
        this.shareVideo=React.createRef();
        this.updateSrc=async()=>{
            var shareAudio=(($(this.shareAudio.current).val()==="yes")?true:false);
            var shareVideo=(($(this.shareVideo.current).val()==="yes")?true:false);
            await this.localStreamManager.getMediaStream(shareVideo,shareAudio) 
            .then(stream=>{
                this.reactPlayer.current.url=stream;
                this.reactPlayer.current.playing=true;
            })
            .catch(error=>{
                console.log(error);
            })
        }
    }
    componentDidMount(){
        this.localStreamManager=new LocalStreamManager();
    }
    componentWillUnmount(){

    }
    render() {
        return(
            <div className="d-flex flex-column justify-content-around">
                <ReactPlayer className='react-player' 
                    ref={this.reactPlayer}
                    controls={true} 
                    volume={0} 
                    muted={true}
                    width='100%'
                    height='100%'/>
                <div className="d-flex flex-row justify-content-around">
                    <div>
                        Share Video
                        <select ref={this.shareVideo} onChange={this.updateSrc}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                    <div>
                        Share Audio
                        <select ref={this.shareAudio} onChange={this.updateSrc}>
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                        </select>
                    </div>
                </div>
            </div>	
        )
    }
}
export default TestReactPeer
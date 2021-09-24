class LocalStreamManager{
    constructor(){
		var templateConstraint={
					"audio":{
								channelCount: 2,
								echoCancellation:true,
								sampleSize: 16
							},
					"video":{
								width:{ min:"640", ideal:"1280", max:"1920"},
								height:{ min:"480", ideal:"720", max:"1080"}
							}
					}; 
		this.closeMedia=(stream)=>{
			console.log("LocalStreamManager.closeMedia");
			console.log(stream);
			if (stream){
				console.log(stream.getTracks().length);
				stream.getTracks().forEach(track=>{
					track.stop()					
					console.log(track.kind+" track is stopped.");					
				})
			}
		}
		this.getMediaStream=async (shareVideo,shareAudio)=>{
			//var constraints={"audio":shareAudio,"video":shareVideo};
			var constraints={};
			if (shareVideo){
				constraints["video"]=templateConstraint.video;
			}
			if (shareAudio){
				constraints["audio"]=templateConstraint.audio;
			}
			console.log("constraints="+JSON.stringify(constraints)); 
			return navigator.mediaDevices.getUserMedia(constraints);
        }
        this.getShareDesktopStream=async(shareVideo,shareAudio)=>{
            if ((shareVideo===false) && (shareAudio===false)){
               return null;     
            } else {
			    var constraints={"audio":shareAudio,"video":shareVideo};
                return navigator.mediaDevices.getDisplayMedia(constraints);
            }
        }
    }
   
}

export default LocalStreamManager;
import {useEffect,useReducer} from 'react';
import io from 'socket.io-client';
import Peer from './Peer';
export default function C(){
    let peerName;
    let signalSocket=io.connect(process.env.REACT_APP_SOCKET_URL+"testMeeting", { transports: ['websocket'] })
    let sUsrAg = navigator.userAgent;
    if (sUsrAg.indexOf("Edg")>-1){
        peerName="Edge";
    }else{
        if (sUsrAg.indexOf("Chrome")>-1){
            peerName="Chrome";
        }else {
            if (sUsrAg.indexOf("Firefox")>-1){
                peerName="Firefox";
            } else {
                if (sUsrAg.indexOf("Safari")>-1){
                    peerName="Safari";
                }
            }
        }
    }
    return(
        <div>
            <button onClick={connect}>Connect</button>
            <div>
            {
                  Object.keys(variables.peerList).map((key,index) => (
                      <div key={index}>
                          {variables.peerList[key].peerName()}
                      </div>
                  ))
              }                               
            </div>
        </div>
    );
}
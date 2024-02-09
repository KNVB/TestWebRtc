export default class SpeechRecognition {
    #speechRecognition;
    /**
     * Creates an instance of SpeechRecognition.
     * @date 8/18/2023 - 11:09:44 AM
     * @class SpeechRecognition
     * @constructor
     */
    constructor(trigger) {
        this.#speechRecognition = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
        this.#speechRecognition.lang = 'zh-HK';
        this.#speechRecognition.continuous = true;
        this.#speechRecognition.interimResults = false;

        this.#speechRecognition.onstart = () => {
            console.log('Speech recognition started');
        };
       
        this.#speechRecognition.onend = () => {
            console.log('Speech recognition ended');
        };
        this.#speechRecognition.addEventListener("audiostart", () => {
            console.log("Audio capturing started");
        });
        this.#speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', JSON.stringify(event.error));
        };
        this.#speechRecognition.onnomatch = () => {
            console.log('No speech was recognized.');
        };
        console.log("SpeechRecognition Object constructor is called.");
//============================================================================================================
        this.onResult=(handler)=>{
            this.#speechRecognition.onresult = (event) => {
                let obj = event.results[event.results.length - 1][0];
                const transcript = obj.transcript;
                const confidence = obj.confidence;
                console.log('=========================');
                console.log(JSON.stringify(event.results));
                console.log('transcript=' + transcript);
                console.log('confidence=' + confidence);
                console.log('=========================');
                handler(transcript);                
            };
        }        
        this.start=()=>{
            this.#speechRecognition.start();
        }
        this.stop=()=>{
            this.#speechRecognition.stop();
        }
    }
}
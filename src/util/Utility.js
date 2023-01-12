export default class Utility {
    static getBrowserName() {
        let userAgent = navigator.userAgent;
        let browserName;
        switch (true) {
            case (userAgent.match(/chrome|chromium|crios/i) !== null):
                browserName = "chrome";
                break;
            case (userAgent.match(/firefox|fxios/i) !== null):
                browserName = "firefox";
                break;
            case (userAgent.match(/safari/i) !== null):
                browserName = "safari";
                break
            case (userAgent.match(/opr\//i) !== null):
                browserName = "opera";
                break;
            case (userAgent.match(/edg/i) !== null):
                browserName = "edge";
                break;
            default:
                break;
        }
        return browserName
    }
}
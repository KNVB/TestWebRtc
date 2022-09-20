export default function QK() {
    return (
        <div variant="dark" className="vh-100 p-1 w-100 card">
            <div className="border border-dark m-1 p-0 rounded text-center card-header">
                <input className="mt-1" placeholder="Please enter your alias" type="text" value="23" />
                <div className="d-flex flex-row justify-content-center">
                    <button type="button" className="m-1 btn btn-primary" disabled="">Join a meeting</button>
                    <button type="button" className="m-1 btn btn-primary">Leave the meeting</button>
                </div>
            </div>
            <div className="border border-dark d-flex m-1 p-0 rounded card-body">
                <div className="d-flex flex-row flex-grow-1">
                    <div className="d-flex flex-grow-1 m-1 rounded card">
                        <div className="m-1 rounded card-header">Global Message</div>
                        <div className="m-0 p-0 position-relative rounded card-body">
                            <div className="h-100 m-0 p-0 position-absolute w-100 overflow-auto"></div>
                        </div>
                    </div>
                </div>
                <div className="border border-dark d-flex flex-column flex-grow-1 m-1 rounded">
                    <div className="card.header m-1 p-1 rounded card-header">Room member list:</div>
                    <div className="border border-dark m-1 p-1 rounded">Peer Name:23(You)<br /></div>
                    <div className="d-flex flex-column flex-grow-1 position-relative">
                        <div className="h-100 m-0 overflow-auto p-0 position-absolute w-100">
                            <div className="d-flex flex-row m-0 p-0 rounded-3 peer w-100">
                                <div className="border border-dark m-1 p-0 position-relative rounded-3 w-50">
                                    <video controls autoPlay muted className="h-100 position-absolute m-0 p-0 rounded-3 w-100" style={{ "object-fit": "cover" }}>
                                        <source src="/VIDEO0101.mp4" />
                                    </video>
                                </div>
                                <div className="border border-dark m-1 p-1 rounded-3 position-relative w-50">
                                    Peer Name:sdff<br/>Status:connected
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border border-dark m-1 p-0 rounded text-center card-footer">
                <div className="d-flex flex-grow-1 flex-row justify-content-center p-1">
                    <input placeholder="Please enter your global message" type="text" value="" />&nbsp;
                    <button type="button" className="btn btn-primary">Send message to all peer</button>
                </div>
                <div className="d-flex flex-grow-1 flex-row justify-content-center p-1">
                    <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                        <div className="m-1">Share Audio:</div>
                        <div className="dropdown">
                            <button aria-haspopup="true" aria-expanded="false" type="button" className="dropdown-toggle btn btn-primary">No</button>
                        </div>
                    </div> &nbsp;
                    <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                        <div className="m-1">Share Video:</div>
                        <div className="dropdown">
                            <button aria-haspopup="true" aria-expanded="false" type="button" className="dropdown-toggle btn btn-primary">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
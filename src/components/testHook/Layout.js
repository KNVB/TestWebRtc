import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
export default function Layout() {
    let a = [], b = [];
    for (let i = 0; i < 40; i++) {
        a.push(<div key={i}>sdd{i}</div>);
    }
    for (let i = 0; i < 40; i++) {
        b.push(
            <div className="d-flex flex-row border border-info m-0 p-0 rounded-3" style={{ "height": "150px" }}>
                <div className="border border-dark m-1 p-0 rounded-3 flex-grow-1 position-relative" style={{"maxWidth":"50%","minWidth":"50%"}}>
                    <video autoPlay muted controls className='h-100 w-100 position-absolute rounded-3' style={{ "objectFit": "cover" ,"left":"0","top": "0"}}>
                        <source src="/VIDEO0101.mp4"></source>
                    </video>
                </div>
                <div className="border border-dark m-1 p-1 rounded-3 flex-grow-1" style={{"maxWidth":"50%"}}>
                    Peer Name:<br />
                    Status:
                </div>
            </div>
        )
    }
    return (
        <Card className="vh-100 p-1 w-100" variant="dark">
            <Card.Header className='border border-dark m-1 p-0 rounded text-center'>
                <input
                    className="mt-1"
                    placeholder="Please enter your alias"
                    type="text" />
                <div className="d-flex flex-row justify-content-center">
                    <Button className="m-1" >Join a meeting</Button>
                    <Button className="m-1" >Leave the meeting</Button>
                </div>
            </Card.Header>
            <Card.Body className='border border-dark d-flex m-1 p-0 rounded'>
                <div className="d-flex flex-row flex-grow-1">
                    <Card className="d-flex flex-grow-1 m-1 rounded">
                        <Card.Header className="m-1 rounded">Global Message</Card.Header>
                        <Card.Body className="m-0 p-0 position-relative rounded">
                            <div className='h-100 m-0 p-0 position-absolute w-100 overflow-auto'>
                                {a}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className="border border-dark d-flex flex-column flex-grow-1 m-1 rounded">
                    <Card.Header className="card.header m-1 p-1 rounded">Room member list:</Card.Header>
                    <div className="border border-dark m-1 p-1 rounded">
                        Peer Name:
                    </div>
                    <div className="d-flex flex-column flex-grow-1 m-1 position-relative">
                        <div className='h-100 m-0 overflow-auto p-0 position-absolute w-100'>
                            {b}
                        </div>
                    </div>
                </div>
            </Card.Body>
            <Card.Footer className='border border-dark m-1 p-0 rounded text-center'>
                <div className='d-flex flex-grow-1 flex-row justify-content-center p-1'>
                    <input
                        placeholder="Please enter your global message"
                        type="text" />
                    &nbsp;
                    <Button>Send message to all peer</Button>
                </div>
                <div className='d-flex flex-grow-1 flex-row justify-content-center p-1'>
                    <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                        <div className="m-1">Share Audio:</div>
                        <DropdownButton title="No" variant="primary">
                            <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                            <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                        </DropdownButton>
                    </div> &nbsp;
                    <div className="align-items-center bg-primary d-flex flex-row p-1 rounded-3 text-white">
                        <div className="m-1">Share Video:</div>
                        <DropdownButton title="No" variant="primary">
                            <Dropdown.Item eventKey={false}>No</Dropdown.Item>
                            <Dropdown.Item eventKey={true}>Yes</Dropdown.Item>
                        </DropdownButton>
                    </div>
                </div>
            </Card.Footer>
        </Card>
    )
}
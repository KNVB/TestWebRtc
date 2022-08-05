import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
export default function Layout() {
    let a = [];
    for (let i = 0; i < 40; i++) {
        a.push(<div key={i}>sdd{i}</div>);
    }    
    
    return (
        <Card className="vh-100 p-1 w-100" variant="dark">
            <Card.Header className='border border-dark m-1 p-0 rounded text-center'>
                <input
                    className="mt-1"
                    placeholder="Please enter your alias"
                    type="text"
                />
                <div className="d-flex flex-row justify-content-center">
                    <Button className="m-1">Join a meeting</Button>
                    <Button className="m-1">Leave the meeting</Button>
                </div>
            </Card.Header>
            <Card.Body className='border border-dark d-flex m-1 p-0 rounded'>
                <div className="d-flex flex-row flex-grow-1">
                    <Card className="d-flex flex-grow-1 m-1 rounded">
                        <Card.Header className="m-1 rounded">A</Card.Header>
                        <Card.Body className="m-0 p-0 position-relative rounded">
                            <div className='h-100 m-0 p-0 position-absolute w-100 overflow-auto'>
                                {a}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="d-flex flex-grow-1 m-1 rounded">
                        <Card.Header className='m-1 rounded'>B</Card.Header>
                        <Card.Body className="m-0 p-0 position-relative rounded">
                            <div className='h-100 m-0 p-0 position-absolute w-100 overflow-auto'>
                                {a}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Card.Body>
            <Card.Footer className='border border-dark m-1 p-0 rounded text-center'>
                <div className="d-flex flex-row flex-grow-1 justify-content-center p-1">
                    <input                   
                        placeholder="Please enter your global message"
                        type="text" />
                    &nbsp;
                    <Button>Send message to all peer</Button>
                </div>
                <div className='d-flex flex-row flex-grow-1 justify-content-center p-1'>
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
import { Button, Card, Col, Container, Navbar, Row } from 'react-bootstrap';

export default function D() {
    return (
        <>
            <Navbar className="bg-success m-0 p-0" fixed="bottom">
                <Container fluid className="bg-danger p-0">
                    <Row className="m-0 p-1">
                        <Col className="bg-white m-0 p-1">
                            <a class="navbar-brand" href="#">Fixed bottom</a>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
        </>
    )
}
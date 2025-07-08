import React, {useContext} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import UserContext from "../Contexts/ContextUser";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FileEarmarkTextFill, ClipboardCheckFill, PlusCircleFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import WelcomeBanner from "./WelcomeBanner";
import "./Dashboard.css";


const Dashboard = () => {
    const { user } = useContext(UserContext);
  return (
    <div className="dashboard-bg py-5">
        {/* <div>token is ${localStorage.getItem('token')}</div> */}
      <Container>
        <WelcomeBanner userName={user} />
        <div className="py-4"></div>
        <Row className="g-4 justify-content-center py-5">
          <Col md={4} sm={6}>
            <Card className="h-100 text-center p-4 dashboard-card border-0 transition-card">
              <FileEarmarkTextFill size={50} className="mb-3 text-primary" />
              <Card.Body>
                <Card.Title>Create Resume</Card.Title>
                <Card.Text>
                  Generate a professional resume tailored to job descriptions.
                </Card.Text>
                <Link to="/input-resume" className="btn btn-outline-primary">Start</Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={6}>
            <Card className="h-100 text-center p-4 dashboard-card border-0 transition-card">
              <ClipboardCheckFill size={50} className="mb-3 text-success" />
              <Card.Body>
                <Card.Title>Track Applications</Card.Title>
                <Card.Text>
                  Monitor the status and history of your job applications.
                </Card.Text>
                <Link to="/applications" className="btn btn-outline-success">Track</Link>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4} sm={6}>
            <Card className="h-100 text-center p-4 dashboard-card border-0 transition-card">
              <PlusCircleFill size={50} className="mb-3 text-warning" />
              <Card.Body>
                <Card.Title>Add New Application</Card.Title>
                <Card.Text>
                  Keep your records updated by logging new job applications.
                </Card.Text>
                <Link to="/add-application" className="btn btn-outline-warning">Add</Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="py-5"></div>
    </div>
  );
};

export default Dashboard;

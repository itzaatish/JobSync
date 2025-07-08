import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="overlay">
        <Container className="text-center text-light py-5">
          <Row className="justify-content-center align-items-center min-vh-100">
            <Col md={10} lg={8}>
              
              {/* ✅ LOGO added here */}
              <img
                src="/logo1.png" // <-- Change this path if your logo is stored elsewhere
                alt="JobSync Logo"
                className="mb-4 landing-logo"
              />

              <h1 className="display-4 fw-bold">Welcome to JobSync</h1>
              <p className="lead mt-4 mb-4">
                JobSync uses AI to take your existing resume and tailor it to fit the exact job description you're applying to.
                Get personalized resumes, CVs, and cover letters with a click.
              </p>
              <p className="lead mt-4 mb-4">
                Keep track of every application, manage your progress, and stay organized through your job hunt.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/login">
                  <Button variant="outline-light" size="lg">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="lg">Get Started</Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;

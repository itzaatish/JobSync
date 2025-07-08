import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./AboutPage.css";

const About = () => {
  return (
    <Container fluid className="about-page text-white py-5">
      <Container>
        <h1 className="text-center mb-4 fw-bold">About JobSync</h1>

        <Row className="mb-5 justify-content-center">
          <Col md={10}>
            <Card className="bg-dark text-white shadow-lg p-4 rounded-4 about-card">
              <Card.Body>
                <Card.Text className="fs-5">
                  <strong>JobSync</strong> is your intelligent job application tracker,
                  built to make your job hunt organized and effortless. Whether you're
                  applying to internships, full-time roles, or freelance projects,
                  JobSync helps you keep every application structured, searchable, and
                  stress-free.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <h3 className="text-center mb-4 fw-semibold">Key Features</h3>
        <Row className="g-4 justify-content-center">
          {[
            {
              title: "Smart Application Tracker",
              desc: "Manage all your job applications in one place with resume, status, and notes.",
            },
            {
              title: "Resume & Cover Letter Linking",
              desc: "Store and reference the exact resume and cover letter used for each job.",
            },
            {
              title: "Search & Sorting",
              desc: "Find applications quickly by company name or sort by date and status.",
            },
            {
              title: "Status Visualization",
              desc: "Track progress visually — from Applied to Offer with clean status indicators.",
            },
            {
              title: "Clean UI",
              desc: "Minimal, distraction-free interface with a modern and responsive design.",
            },
            {
              title: "AI-Powered Features (Coming Soon)",
              desc: "Tailor your resume and cover letter automatically using AI for each job.",
            },
          ].map((feature, idx) => (
            <Col md={6} lg={4} key={idx}>
              <Card className="bg-secondary bg-opacity-25 text-white h-100 rounded-4 border-0 shadow-sm">
                <Card.Body>
                  <Card.Title className="fs-5 fw-bold">{feature.title}</Card.Title>
                  <Card.Text>{feature.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="my-5 justify-content-center">
          <Col md={10}>
            <h3 className="text-center mb-4 fw-semibold">About the Creator</h3>
            <Card className="bg-dark text-white shadow-lg p-4 rounded-4 about-card">
              <Card.Body>
                <Card.Text className="fs-5">
                  <strong>Aatish Kumar</strong>, a tech enthusiast and full-stack developer,
                  built JobSync with the mission to simplify the job-hunting experience.
                  With experience in backend APIs, UI design, and AI integration,
                  Aatish blends functionality with simplicity, creating tools that
                  actually help people move forward in their careers.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default About;

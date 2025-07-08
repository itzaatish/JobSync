import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Spinner, Row, Col } from 'react-bootstrap';
import { format, set } from 'date-fns';
import LoadingContext from '../Contexts/ContextLoading';
import { ArrowLeft, PencilSquare } from 'react-bootstrap-icons';
import './SingleApplicationPage.css';
import BannerContext from '../Contexts/ContextBanner';

const SingleApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);
  const { setLoading } = useContext(LoadingContext);
  const { setBannerMessage , setBanner , setBannerType } = useContext(BannerContext)
  const BaseURL = process.meta.env.REACT_APP_BASE_URL ;

  useEffect(() => {
    const fetchSingleApplication = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BaseURL}/applications/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplication(response.data.application);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching application:', err);
        setBannerMessage("Failed to fetch application details.");
        setBannerType("alert");
        setBanner(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSingleApplication();
  }, [id]);

  if (error) {
    return <p className="text-center mt-5 text-danger">{error}</p>;
  }


  if (!application) {
  return (
    <div className="d-flex justify-content-center align-items-center vh-50 mt-5">
    </div>
  );
}

// Destructure safely after the check
const {
  company_name,
  job_title,
  status,
  application_date,
  creation_date,
  personal_note,
  resume_used,
  cover_letter_used
} = application;

  const statusColor = {
    APPLIED: 'primary',
    INTERVIEW: 'warning',
    REJECTED: 'danger',
    OFFER: 'success',
  }[status] || 'secondary';

  const fallback = (value) => value || "No input provided";

  return (
    <Container className="py-5 mt-4">
      <Link to="/applications" className="text-decoration-none mb-3 d-inline-block text-dark">
        <ArrowLeft size={20} className="me-2" />
        Back to Applications
      </Link>

      <Card className="shadow-lg p-4 single-app-card rounded-4">
        <Card.Title className="mb-4 fs-3 fw-bold text-dark">
          {fallback(company_name)}{" "}
          <span className="text-muted fs-5">({fallback(job_title)})</span>
        </Card.Title>
        <div className='py-3'></div>

        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <Card.Text className="fs-6">
              <strong>Status:</strong>{" "}
              <span className={`text-${statusColor} text-capitalize`}>{status}</span>
            </Card.Text>
          </Col>
          <Col md={6} className="mb-2">
            <Card.Text className="fs-6">
              <strong>Applied on:</strong>{" "}
              {application_date ? format(new Date(application_date), 'dd MMM yyyy') : "Not provided"}
            </Card.Text>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <Card.Text className="fs-6">
              <strong>Created on:</strong>{" "}
              {creation_date ? format(new Date(creation_date), 'dd MMM yyyy, hh:mm a') : "Unknown"}
            </Card.Text>
          </Col>
          <Col md={6} className="mb-2">
            <Card.Text className="fs-6">
              <strong>Resume Used:</strong>{" "}
              {resume_used ? (
                <a
                  href={resume_used}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-underline text-primary"
                >
                  View Resume
                </a>
              ) : (
                "No input provided"
              )}
            </Card.Text>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6} className="mb-2">
            <Card.Text className="fs-6">
              <strong>Cover Letter:</strong>{" "}
              {cover_letter_used ? (
                <a
                  href={cover_letter_used}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-underline text-primary"
                >
                  View Cover Letter
                </a>
              ) : (
                "No input provided"
              )}
            </Card.Text>
          </Col>
          <Col md={6} className="mb-2 d-flex align-items-center justify-content-between">
            <Card.Text className="fs-6 mb-0">
              <strong>Notes:</strong> {fallback(personal_note)}
            </Card.Text>
            <PencilSquare
              size={18}
              className="text-secondary ms-2 cursor-pointer"
              title="Edit Notes"
              style={{ cursor: 'pointer' }}
              onClick={() => alert("Open notes editor or modal here")}
            />
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default SingleApplication;

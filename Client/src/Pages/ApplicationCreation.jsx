import React, { useState, useContext } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import LoadingContext from '../Contexts/ContextLoading';

const CreateApplication = () => {
  const [formData, setFormData] = useState({
    CompanyName: '',
    JobTitle: '',
    ResumeUsed: '',
    CoverLetterUsed: '',
    Status: 'APPLIED',
    ApplicationDate: '',
    PersonalNotes: '',
  });

  const [errors, setErrors] = useState({});
  const { setLoading } = useContext(LoadingContext);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.CompanyName.trim()) newErrors.CompanyName = 'Company name is required.';
    if (!formData.ApplicationDate) newErrors.ApplicationDate = 'Application date is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('Submitting...');

      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post('http://localhost:2000/create_application', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage(response.data.message || '✅ Application submitted successfully!');
      setFormData({
        CompanyName: '',
        JobTitle: '',
        ResumeUsed: '',
        CoverLetterUsed: '',
        Status: 'APPLIED',
        ApplicationDate: '',
        PersonalNotes: '',
      });

    } catch (error) {
      console.error('Submission error:', error);
      setStatusMessage('❌ Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <Container className="py-5 mt-5">
    <Row className="justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <div className="text-center mb-4">
          <h2 className="fw-bold text-secondary display-6 custom-heading">
            Create a New Job Application
          </h2>
        </div>

        <Card className="p-4 shadow-sm rounded w-100">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              {/* Company Name */}
              <Col md={6}>
                <Form.Group controlId="CompanyName">
                  <Form.Label>
                    Company Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="CompanyName"
                    placeholder="Enter company name"
                    value={formData.CompanyName}
                    onChange={handleChange}
                    isInvalid={!!errors.CompanyName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.CompanyName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Job Title */}
              <Col md={6}>
                <Form.Group controlId="JobTitle">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="JobTitle"
                    placeholder="e.g. Frontend Developer"
                    value={formData.JobTitle}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Resume Used */}
              <Col md={6}>
                <Form.Group controlId="ResumeUsed">
                  <Form.Label>Resume Used</Form.Label>
                  <Form.Control
                    type="text"
                    name="ResumeUsed"
                    placeholder="Resume link or name"
                    value={formData.ResumeUsed}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Cover Letter Used */}
              <Col md={6}>
                <Form.Group controlId="CoverLetterUsed">
                  <Form.Label>Cover Letter Used</Form.Label>
                  <Form.Control
                    type="text"
                    name="CoverLetterUsed"
                    placeholder="Cover letter name or link"
                    value={formData.CoverLetterUsed}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Status */}
              <Col md={6}>
                <Form.Group controlId="Status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={formData.Status}
                    onChange={handleChange}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="OFFER">Offer</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Application Date */}
              <Col md={6}>
                <Form.Group controlId="ApplicationDate">
                  <Form.Label>
                    Application Date <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="ApplicationDate"
                    value={formData.ApplicationDate}
                    onChange={handleChange}
                    isInvalid={!!errors.ApplicationDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ApplicationDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Personal Notes */}
              <Col xs={12}>
                <Form.Group controlId="PersonalNotes">
                  <Form.Label>Personal Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="PersonalNotes"
                    placeholder="Write any thoughts or notes..."
                    value={formData.PersonalNotes}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <Button variant="primary" type="submit" size="lg">
                Submit Application
              </Button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div className="text-center mt-3">
                <span className="text-muted">{statusMessage}</span>
              </div>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  </Container>
);

};

export default CreateApplication;

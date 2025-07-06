import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { FaFilePdf } from 'react-icons/fa';
import LoadingContext from '../Contexts/ContextLoading';
import axios from 'axios';
import './ResumeUpload.css';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const { setLoading } = useContext(LoadingContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !description) {
      setStatus('⚠️ Please select a PDF and fill job description.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('description', description);

    try {
      setLoading(true);
      setStatus('📤 Uploading...');
      const response = await axios.post('http://localhost:2000/upload', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' ,
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token for authentication
        }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus('✅ Resume downloaded successfully.');
    } catch (err) {
      console.error(err);
      setStatus('❌ Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 mt-5">
      <h2 className="text-center mb-4">Upload Your Resume & Job Description</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="justify-content-center g-4">
          {/* Resume Upload */}
          <Col md={5}>
            <Card className={`upload-box p-4 ${file ? 'file-selected' : ''}`}>
              <Form.Group controlId="formFile" className="text-center">
                <Form.Label className="fw-bold mb-3">Upload Resume (PDF Only)</Form.Label>
                {file && (
                  <div className="pdf-icon mb-3">
                    <FaFilePdf size={120} color="#c53030" />
                    <p className="mt-1 small">{file.name}</p>
                  </div>
                )}
                <Form.Control type="file" accept=".pdf" onChange={handleFileChange} />
              </Form.Group>
            </Card>
          </Col>

          {/* Job Description */}
          <Col md={7}>
            <Card className="p-4">
              <Form.Group controlId="formDescription">
                <Form.Label className="fw-bold mb-2">Paste Job Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={9}
                  placeholder="Paste the job description here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </Card>
          </Col>
        </Row>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <Button variant="primary" type="submit" size="lg" className="px-5 py-2">
            Submit
          </Button>
        </div>

        {/* Status */}
        {status && (
          <div className="text-center mt-3">
            <p className="text-muted">{status}</p>
          </div>
        )}
      </Form>
    </Container>
  );
};

export default ResumeUploader;

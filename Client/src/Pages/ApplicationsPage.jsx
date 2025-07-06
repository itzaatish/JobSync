import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import ApplicationCard from '../Components/ApplicationCard';
import LoadingContext from '../Contexts/ContextLoading';


const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const { setLoading } = useContext(LoadingContext);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get('http://localhost:2000/get_applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApplications(response.data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Fetching applications...");
    fetchApplications();
  }, []);

  return (
    <Container className="py-5 mt-5">
      <h2 className="text-center mb-4">Your Job Applications</h2>
      <Row className="g-4 justify-content-center">
        {applications.length > 0 ? (
          applications.map((app) => (
            <Col md={9} lg={9} key={app.application_id}>
              <ApplicationCard
                application={app}
                onDelete={fetchApplications} // refresh list after deletion
              />
            </Col>
          ))
        ) : (
          <p className="text-center">No applications found.</p>
        )}
      </Row>
    </Container>
  );
};

export default ApplicationsPage;

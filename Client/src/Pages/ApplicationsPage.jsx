import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import ApplicationCard from "../Components/ApplicationCard";
import LoadingContext from "../Contexts/ContextLoading";
import "./ApplicationsPage.css";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const { setLoading } = useContext(LoadingContext);
  const BaseURL = import.meta.env.VITE_APP_BASE_URL;
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BaseURL}/get_applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data.applications || [];
      setApplications(data);
      setFilteredApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    let filtered = applications.filter((app) =>
      app.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    switch (sortBy) {
      case "Newest":
        filtered.sort(
          (a, b) => new Date(b.application_date) - new Date(a.application_date)
        );
        break;
      case "Oldest":
        filtered.sort(
          (a, b) => new Date(a.application_date) - new Date(b.application_date)
        );
        break;
      case "Status":
        filtered.sort((a, b) =>
          (a.status || "").localeCompare(b.status || "")
        );
        break;
      case "Company Name":
        filtered.sort((a, b) =>
          (a.company_name || "").localeCompare(b.company_name || "")
        );
        break;
      default:
        break;
    }

    setFilteredApplications(filtered);
  }, [searchQuery, sortBy, applications]);

  const handleDeleteLocally = (applicationId) => {
    const updated = applications.filter(
      (app) => app.application_id !== applicationId
    );
    setApplications(updated);
  };

  const handleStatusUpdateLocally = (applicationId, newStatus) => {
    const updated = applications.map((app) =>
      app.application_id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
  };

  const handleCardClick = (e, applicationId) => {
    // Prevent navigation if click happened inside interactive controls
    if (
      e.target.closest("button") ||
      e.target.closest("select") ||
      e.target.closest(".prevent-link") ||
      e.target.tagName.toLowerCase() === "svg" ||
      e.target.tagName.toLowerCase() === "path"
    ) {
      return; // Do not navigate
    }

    // Navigate to application details page
    navigate(`/application/${applicationId}`);
  };

  return (
    <Container className="py-5 mt-4">
      <h2 className="text-center mb-4 fw-bold text-dark">
        Your Job Applications
      </h2>

      {/* Search and Sort Controls */}
      <Row className="mb-4 justify-content-between align-items-center px-2">
        <Col md={6} className="mb-2">
          <InputGroup>
            <InputGroup.Text>🔍</InputGroup.Text>
            <Form.Control
              placeholder="Search by company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="mb-2 d-flex justify-content-end">
          <DropdownButton
            variant="outline-secondary"
            title={`Sort By: ${sortBy}`}
            onSelect={(key) => setSortBy(key)}
          >
            <Dropdown.Item eventKey="Newest">Date Applied: Newest</Dropdown.Item>
            <Dropdown.Item eventKey="Oldest">Date Applied: Oldest</Dropdown.Item>
            <Dropdown.Item eventKey="Company Name">Company Name</Dropdown.Item>
            <Dropdown.Item eventKey="Status">Status</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {/* Applications List */}
      <Row className="g-4 justify-content-center mx-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <Col md={9} lg={9} key={app.application_id}>
              <div
                className="application-click-wrapper"
                onClick={(e) => handleCardClick(e, app.application_id)}
                style={{ cursor: "pointer" }}
              >
                <ApplicationCard
                  application={app}
                  onDelete={() => handleDeleteLocally(app.application_id)}
                  onStatusChange={(newStatus) =>
                    handleStatusUpdateLocally(app.application_id, newStatus)
                  }
                />
              </div>
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

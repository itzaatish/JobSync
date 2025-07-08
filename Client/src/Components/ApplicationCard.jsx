import React, { useContext } from 'react';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { format, set } from 'date-fns';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import BannerContext from '../Contexts/ContextBanner';
import './ApplicationCard.css';

const statusColors = {
  APPLIED: 'rgba(124, 151, 160, 0.25)',
  INTERVIEW: 'rgba(235, 127, 26, 0.35)',
  REJECTED: 'rgba(244, 39, 39, 0.24)',
  OFFER: 'rgba(7, 236, 29, 0.34)',
};

const ApplicationCard = ({ application, onDelete, onStatusChange }) => {
  const { company_name, job_title, status, application_date, application_id } = application;
  const {setBannerMessage , setBannerType , setBanner , setConfirmAction } = useContext(BannerContext);
  
  const handleDeleteConfimation = () => {
    setBannerMessage("Are you sure you want to delete this application?");
    setBannerType("confirm");
    setBanner(true);
    setConfirmAction(handleDelete);
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:2000/applications/${application_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setBannerMessage("Application deleted successfully!");
        setBannerType("alert"); 
        setBanner(true);
        onDelete(application_id);
      } else {
        setBannerMessage("Failed to delete application.");
        setBannerType("alert");
        setBanner(true);
      }
    } catch (error) {
        setBannerMessage("Failed to delete application.");
        setBannerType("alert");
        setBanner(true);
      console.error("Failed to delete:", error);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
    //   setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `http://localhost:2000/applications/${application_id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setBannerMessage("Application status updated successfully!");
        setBannerType("alert");
        setBanner(true);
        onStatusChange(newStatus);
      } else {
        setBannerMessage("Failed to update status.");
        setBannerType("alert");
        setBanner(true);
      }
    } catch (err) {
        setBannerMessage("Failed to update status.");
        setBannerType("alert");
        setBanner(true);
      console.error("Status update failed", err);
    }
  };

  const formattedDate = application_date
    ? format(new Date(application_date), 'dd MMM yyyy')
    : 'Not specified';

  return (
    <Card
      className="application-card compact-card mb-3"
      style={{ backgroundColor: statusColors[status] || '#f5f5f5' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="fw-semibold fs-6">
          {company_name} - <span className="text-muted small">{job_title || 'No Title'}</span>
        </div>
        <div className="text-muted small">{formattedDate}</div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2 prevent-link">
        {/* Status Dropdown */}
        <select
          id={`status-${application_id}`}
          className="form-bar form-select form-select-sm"
          style={{ minWidth: '120px' }}
          value={status}
          onChange={handleStatusChange}
        >
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="REJECTED">Rejected</option>
          <option value="OFFER">Offer</option>
        </select>

        {/* Action Buttons */}
        <div className="d-flex gap-2 prevent-link">
          <Button className="prevent-link" variant="outline-danger" size="sm" onClick={handleDeleteConfimation}>
            <Trash size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationCard;

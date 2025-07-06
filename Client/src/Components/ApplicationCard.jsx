import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import './ApplicationCard.css';

const statusColors = {
  APPLIED: 'rgba(124, 151, 160, 0.25)',
  INTERVIEW: 'rgba(235, 127, 26, 0.35)',
  REJECTED: 'rgba(244, 39, 39, 0.24)',
  OFFER: 'rgba(7, 236, 29, 0.34)',
};

const ApplicationCard = ({ application, onDelete, onStatusChange }) => {
  const { company_name, job_title, status, application_date, application_id } = application;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:2000/applications/${application_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            onDelete();
            } catch (error) {
                console.error("Failed to delete:", error);
            }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        try {
            const token = localStorage.getItem("token");
            await axios.patch(`http://localhost:2000/applications/${application_id}`, {
                status: newStatus,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
                onStatusChange();
            } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const formattedDate = application_date
        ? format(new Date(application_date), 'dd MMM yyyy')
        : 'Not specified';

    return (
        <Card className="application-card compact-card mb-3" style={{ backgroundColor: statusColors[status] || '#f5f5f5' }}>
        <div className="d-flex justify-content-between align-items-center mb-1">
            <div className="fw-semibold fs-6">
            {company_name} - <span className="text-muted small">{job_title || 'No Title'}</span>
            </div>
            <div className="text-muted small">{formattedDate}</div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-2">
    {/* Status Dropdown on the left */}
            <select
                id={`status-${application_id}`}
                className="form-bar form-select form-select-sm w-auto"
                value={status}
                onChange={handleStatusChange}
            >
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="REJECTED">Rejected</option>
                <option value="OFFER">Offer</option>
            </select>

            {/* Action Buttons on the right */}
            <div className="d-flex gap-2">
                <Button variant="outline-dark" size="sm">
                <PencilSquare size={14} />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={handleDelete}>
                <Trash size={14} />
                </Button>
            </div>
            </div>

        </Card>
    );
};

export default ApplicationCard;

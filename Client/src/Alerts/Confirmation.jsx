import React, { useContext } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { ExclamationTriangleFill } from 'react-bootstrap-icons';
import BannerContext from '../Contexts/ContextBanner';
import './Confirmation.css';

const ConfirmBanner = () => {
  const {
    bannerMessage,
    showBanner,
    confirmAction,
    resetBanner,
  } = useContext(BannerContext);

  if (!showBanner) return null;

  const handleConfirm = () => {
    if (confirmAction) confirmAction(); // Execute the dynamic action
    resetBanner(); // Always close after action
  };

  const handleCancel = () => {
    resetBanner(); // Close without doing anything
  };

  return (
    <div className="confirm-overlay">
      <Container className="vh-100 d-flex justify-content-center align-items-center">
        <Card className="text-center p-4 shadow confirm-card">
          <ExclamationTriangleFill size={50} className="text-warning mb-3" />
          <Card.Title className="fw-bold mb-3">{bannerMessage}</Card.Title>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="danger" onClick={handleConfirm}>
              Confirm
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default ConfirmBanner;

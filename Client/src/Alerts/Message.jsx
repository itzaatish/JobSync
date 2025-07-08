import React, { useContext, useEffect } from 'react';
import { Alert, Container } from 'react-bootstrap';
import BannerContext from '../Contexts/ContextBanner';
import './Message.css';

const MessageBanner = () => {
  const { bannerMessage, bannerType, showBanner, resetBanner } = useContext(BannerContext);

  useEffect(() => {
    if (showBanner && bannerType === "alert") {
      const timeout = setTimeout(() => {
        resetBanner(); // hide after 3 seconds
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [showBanner, bannerType, resetBanner]);

  if (!showBanner || bannerType !== "alert") return null;

  return (
    <div className="message-banner">
      <Container className="d-flex justify-content-center">
        <Alert
          variant="danger"
          className="rounded-pill px-4 py-2 shadow-sm text-center fw-semibold"
        >
          {bannerMessage}
        </Alert>
      </Container>
    </div>
  );
};

export default MessageBanner;

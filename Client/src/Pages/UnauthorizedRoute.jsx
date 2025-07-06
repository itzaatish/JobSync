import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Unauthorized = () => {
  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light text-center">
      <h1 className="display-4 text-danger">403 - Unauthorized</h1>
      <p className="lead text-secondary">You must be logged in to view this page.</p>
      <Link to="/login" className="btn btn-dark mt-3">
        Go to Login
      </Link>
    </div>
  );
};

export default Unauthorized;

import React, { useState, useContext } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaUserCircle, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Contexts/ContextAuth";
import UserContext from "../Contexts/ContextUser";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const { user , clearData } = useContext(UserContext);
  const navigate = useNavigate();

  const setLogout = () => {
    localStorage.removeItem("token");
    logout();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      bg="light"
      variant="light"
      className="custom-navbar shadow-sm"
      expanded={expanded}
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="/dashboard" className="navbar-brand-text">
          JobSync
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <FaBars color="#333" size={24} />
        </Navbar.Toggle>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links-wrapper">
            {!isLoggedIn ? (
              <>
                <Nav.Link href="/login" className="nav-link-custom">Login</Nav.Link>
                <Nav.Link href="/signup" className="nav-link-custom">Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/generate-resume" className="nav-link-custom">
                  Generate Resume
                </Nav.Link>
                <Nav.Link href="/track-applications" className="nav-link-custom">
                  Track Applications
                </Nav.Link>
                <Nav.Link href="/add-application" className="nav-link-custom">
                  New Application
                </Nav.Link>
              </>
            )}
          </Nav>
          {isLoggedIn && (
            <Dropdown align="end" className="profile-dropdown">
              <Dropdown.Toggle
                variant="light"
                className="d-flex align-items-center border-0 profile-toggle"
                id="dropdown-basic"
              >
                <FaUserCircle size={24} className="me-1 text-white" />
                <span className="profile-text">{user.name}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/profile">My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={setLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

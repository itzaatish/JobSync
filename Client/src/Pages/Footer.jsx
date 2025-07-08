import React from "react";

const Footer = () => {
  const initials = "AK"; 
  
  return (
    <footer className="bg-black text-white py-2 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        
        <div className="d-flex align-items-center mb-3 mb-md-0">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center me-2"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "#222",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {initials}
          </div>
          <span className="fw-semibold">JobSync by Aatish Kumar</span>
        </div>

        
        <div className="text-center text-md-start mb-3 mb-md-0">
          <a href="about" className="text-white text-decoration-none me-3">About</a>
          <a href="https://itzaatish.github.io/Portfolio/#/contact" target="blank" className="text-white text-decoration-none me-3">Contact</a>
          <a href="#terms" className="text-white text-decoration-none">Terms</a>
        </div>

        
        <div className="text-center text-md-end small">
         &copy; {new Date().getFullYear()} JobSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

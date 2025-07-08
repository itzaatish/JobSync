import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Pages/Header.jsx";
import Footer from "../Pages/Footer.jsx";
import "../Pages/Header.css";

const AppLayout = () => (
  
    <div className="d-flex flex-column min-vh-100">
        <Header/>
        <div className="flex-grow-1 mt-5 pt-3">
            <Outlet />
        </div>
        <Footer />
    </div>
 
);

export default AppLayout;


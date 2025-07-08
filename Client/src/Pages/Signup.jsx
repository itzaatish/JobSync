import React, { useState , useContext} from "react";
import  UserContext  from "../Contexts/ContextUser";
import LoadingContext from "../Contexts/ContextLoading";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css"; 

const Signup = () => {
  // 1. State for each input
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const BaseURL = process.meta.env.REACT_APP_BASE_URL; 
  const { getData } = useContext(UserContext);
  const { setLoading } = useContext(LoadingContext);

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError("");       

        // Basic validation
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        // ✅ Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const payload = {
            nameUser: name,
            mailUser: email,
            passwordUser: password
        };

        try {
            setLoading(true);
            const response = await axios.post(`${BaseURL}/signup`, payload);
            console.log("Signup success:", response.data);
        
            localStorage.setItem("token", response.data.token);
            const { user_id, name, mail_id } = response.data.user;
            getData(user_id, name, mail_id); 
            navigate("/dashboard");
            return ; 

        } catch (err) {
            console.error("Signup error:", err.response?.data || err.message);
            setError("Signup failed. Try again.") ;
        }
        finally{
            setLoading(false);
        }
    };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="form-container w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4">Create Account</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Re-enter Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 mt-3">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;

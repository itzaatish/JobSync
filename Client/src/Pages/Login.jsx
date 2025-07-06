import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../Contexts/ContextUser";
import LoadingContext from "../Contexts/ContextLoading";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // if any custom styles

const Login = () => {
  const navigate = useNavigate();
  const { getData } = useContext(UserContext);
  const { isLoading , setLoading } = useContext(LoadingContext);
  console.log(isLoading);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const payload = {
      mailUser: email,
      passwordUser: password,
    };

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:2000/login", payload);

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      getData(user.user_id, user.name, user.mail_id);
      console.log(isLoading);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid email or password.");
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="form-container w-100" style={{ maxWidth: "400px" }}>
        <h3 className="text-center mb-4" style={{ color: "#222" }}>Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-secondary">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>val of loadin is {isLoading}</div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-secondary">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label text-secondary" htmlFor="remember">
                Remember me
              </label>
            </div>
            <a href="#" className="text-muted" style={{ fontSize: "0.9rem" }}>
              Forgot password?
            </a>
          </div>
          <button type="submit" className="btn btn-dark w-100 mt-2">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

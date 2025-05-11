import React, { useState } from "react";
import { useNavigate,useLocation, Link } from "react-router-dom";
import ApiService from "../services/ApiService"
import '../style/LoginPage.css'
import { FaGoogle } from "react-icons/fa";


const LoginPage = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!email || !password){
      setError('Please fill all fields.')
      setTimeout(()=> setError(''), 5000)
      return
    }

    try{
      const response = await ApiService.loginUser({email, password})

      if(response.statusCode === 200){
        localStorage.setItem('token', response.token)
        localStorage.setItem('role', response.role)
        navigate(from, { replace: true })
      }
    }
    catch(error){
      setError(error.response?.data?.message || error.message)
      setTimeout(()=> setError(''), 5000)
    }
  }


  return (
    <div className="login-page">
      {error && <div className="register-notification-error">{error}</div> }
      <div className="register-card">
      <Link to='/home' className="register-card-logo">
      <h1>calisthenix</h1></Link>
      <form onSubmit={handleSubmit}>
        <div className="login-input">
        <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              required
              placeholder="Email"
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <div>
              <button className="login-form-submit" type="submit">Login</button>
              {/* <button className="login-form-submit" type="submit" onClick={handleSubmit}>
              <FaGoogle className="button-google-icon"/>
                Google Login</button> */}
            </div>
        </div>
      </form>
      </div>

    </div>
    
  )
}
export default LoginPage
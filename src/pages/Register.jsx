import { useState } from "react";
import ApiService from "../services/ApiService";
import { Link, useNavigate } from "react-router-dom";
import "../style/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, email, password, age, height, weight } = formData;
    if (!name || !email || !password || !age || !height || !weight) {
      return false;
    }
    return true;
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage("Please fill all fields.");
      setTimeout((setErrorMessage(""), 5000));
      return;
    }


    try {
      const response = await ApiService.registerUser(formData);

      if (response.statusCode === 200) {
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          height: "",
          weight: "",
        });
        setSuccessMessage("Thanks for joining calisthenix!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login", {replace: true});
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  return (
    <div className="register-page">
        {errorMessage && <div className="register-notification-error">{errorMessage}</div> }
        {successMessage && <div className="register-notification-success">{successMessage}</div> }
        
      <div className="register-card">
        <Link to='/home' className="register-card-logo">
        <h1>calisthenix</h1></Link>
        <form onSubmit={handleSubmit}>
          <div className="register-input">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Preferred Name"
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Email"
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Password"
            />
            <div className="register-input-2">
              <div className="register-age">
                <label>Age <span>(yr)</span></label>
                <input
                  className="register-number"
                  type="number"
                  name="age"
                  min={10}
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  placeholder="10"
                />
              </div>
              <div className="register-age">
              <label>Height <span>(cm)</span></label>
              <input
                className="register-number"
                type="number"
                name="height"
                min={100}
                value={formData.height}
                onChange={handleInputChange}
                required
                placeholder="100"
              />
              </div>

              <div className="register-age">
              <label>Weight <span>(kg)</span></label>
              <input
                className="register-number"
                type="number"
                name="weight"
                min={20}
                value={formData.weight}
                onChange={handleInputChange}
                required
                placeholder="20"
              />
              </div>
              
              
            </div>
            <div>
              <button className="form-submit" type="submit">Sign Up</button>
              <p className="form-existing-user">Already registered?
                <Link to='/login'> Login</Link> here.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;

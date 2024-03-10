import { useState, useEffect } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [agreement, setAgreement] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        email: '',
        password: '',
        loginError: ''
    });

    const navigate = useNavigate(); // Using useNavigate instead of useHistory

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    const handdleShowHide = () => {
      setShowPassword(prevState => !prevState)
    }

    const handleAgreement = (e) => {
      setAgreement(prevState => !prevState)
    }

    const handdleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                email: user.email,
                password: user.password
            });

            const { data } = response;
            // If login successful, navigate to '/account' route
            if (response.status === 200) {
                const token = data.token;
                localStorage.setItem('token', token);
                setTimeout(() => {
                    navigate('/account');
                }, 300);
            }
        } catch (error) {
            // If error occurs, set error message
            setErrorMessage({
                ...errorMessage,
                loginError: error.response.data
            });
            console.log(error.response.data);
        }
    };

    return (
        <div className="card col-sm-10 col-md-6 col-lg-4 col-xl-3 col-xxl-3 box-shadow bg-transparent">
            <div className="card-header bg-white p-3">
                <h3 className="card-title">Login</h3>
                <small className="card-text">
                    System build upon Bootstrap, React, Node, Express and PostgreSQL.
                </small>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handdleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input 
                            type="email" 
                            className="form-control border border-secondary-subtle" 
                            id="email" 
                            placeholder="E.g. you@mail.com" 
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                        />
                        { errorMessage.email && <small className="form-text text-danger">{errorMessage.email}</small> }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group mb-3">
                          <input 
                              type={showPassword ? "text" : "password"} 
                              className="form-control border border-secondary-subtle" 
                              id="password"
                              placeholder="Type your Password" 
                              aria-label="User's Password" 
                              aria-describedby="button-addon" 
                              name="password"
                              value={user.password}
                              onChange={handleChange}
                          />
                          <button 
                              className="btn border border-secondary-subtle bg-white text-dark" 
                              type="button" 
                              id="button-addon"
                              onClick={handdleShowHide}
                          >
                              { showPassword ? <BsEyeSlash /> : <BsEye /> }
                          </button>
                      </div>
                      { errorMessage.password && <small className="form-text text-danger">{errorMessage.password}</small> }
                    </div>
                    <div className="mb-3">
                        <div className="form-check">
                            <input 
                                type="checkbox" 
                                className="form-check-input border border-secondary-subtle cursor-pointer" 
                                id="exampleCheck" 
                                name="agreement"
                                checked={agreement ? true : false}
                                onChange={handleAgreement}
                            />
                            <label className="form-check-label" htmlFor="exampleCheck">
                                I accept and agree to the <a href="#" className="btn-link">Terms and Conditions</a>
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button 
                            disabled={!agreement || user.email.length < 6 || user.password.length < 3}
                            className={`btn ${!agreement || user.email.length < 6 || user.password.length < 3 ? 
                                        "btn-secondary" : "btn-primary"}`} 
                            type="submit"
                        >
                              Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="card-footer bg-white">
                <p>Don't have an account? <Link to="/signup" className="btn-link">Signup</Link></p>
                { errorMessage.loginError && <small className="form-text text-danger">{errorMessage.loginError.message}</small> }
            </div>
        </div>
    )
}

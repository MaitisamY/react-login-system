import { useState, useEffect } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup() {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const [agreement, setAgreement] = useState(false);

    const [errorMessage, setErrorMessage] = useState({
        name: '',
        email: '',
        password: '',
        signupError: ''
    });

    const [loading, setLoading] = useState(false);

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
        setLoading(true); // Show loader
    
        try {
            // Simulate a delay of 1 second before making the API call
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            const response = await axios.post('http://localhost:3001/signup', {
                name: user.name,
                email: user.email,
                password: user.password
            });
    
            // If signup successful, navigate to '/account' route
            if (response.status === 200) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                setTimeout(() => {
                    navigate('/account');
                }, 300);
            }
        } catch (error) {
            // If error occurs, set error message
            setErrorMessage({
                ...errorMessage,
                signupError: error.response.data
            });
            console.log(error.response.data);
        } finally {
            setLoading(false); // Hide loader regardless of success or failure
        }
    };
    

    return (
        <div className="card col-sm-10 col-md-6 col-lg-4 col-xl-3 col-xxl-3 box-shadow bg-transparent">
            <div className="card-header bg-white p-3">
                <h3 className="card-title">Sign up</h3>
                <small className="card-text">
                    System build upon Bootstrap, React, Node, Express and PostgreSQL.
                </small>
            </div>
            <div className="card-body p-4">
                <form onSubmit={handdleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input 
                            type="text" 
                            className="form-control border border-secondary-subtle" 
                            id="name" 
                            placeholder="E.g. John Doe" 
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                        />
                        <small className="form-text text-sm text-muted">Minimum 4 characters required</small>
                        { errorMessage.name && <small className="form-text text-danger">{errorMessage.name}</small> }
                    </div>
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
                        <small className="form-text text-sm text-muted">Minimum 6 characters required</small>
                        { errorMessage.email && <small className="form-text text-danger">{errorMessage.email}</small> }
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <div className="input-group">
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
                      <small className="form-text text-sm text-muted">Minimum 6 characters required</small>
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
                                I accept and agree to the <Link to="/terms" className="btn-link">Terms and Conditions</Link>
                            </label>
                        </div>
                    </div>
                    <div className="d-grid">
                        <button 
                            disabled={!agreement || user.name.length < 4 || user.email.length < 6 || user.password.length < 3}
                            className={`btn ${!agreement || user.name.length < 4 || user.email.length < 6 || user.password.length < 3 ? 
                                        "btn-secondary" : "btn-primary"}`} 
                            type="submit"
                        >
                              Signup { loading && <div className="spinner-border spinner-border-sm ms-2" role="status"></div> }
                        </button>
                    </div>
                </form>
            </div>
            <div className="card-footer bg-white">
                <p>Already have an account? <Link to="/login" className="btn-link">Sign in</Link></p>
                {  
                    errorMessage.signupError && <h5 className="form-text text-danger">{errorMessage.signupError.message}</h5> 
                }
            </div>
        </div>
    )
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function Account() {
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
                console.log(response.data);
            } catch (error) {
                navigate('/login');
            }
        };

        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setTimeout(() => {
            navigate('/login');
        }, 300);
    }

    return (
        <div className="card col-sm-10 col-md-6 col-lg-4 col-xl-3 col-xxl-3 box-shadow bg-transparent">
            <div className="card-header bg-white p-3">
                <h3 className="card-title">Account</h3>
                <small className="card-text">
                    System build upon Bootstrap, React, Node, Express and PostgreSQL.
                </small>
            </div>
            <div className="card-body p-4">
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{user && user.name}</td>
                            <td>{user && user.email}</td>
                            <td><button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

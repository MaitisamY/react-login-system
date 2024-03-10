import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export default function Account() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3001/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data);
            } catch (error) {
                navigate('/login');
            }
        };

        fetchUser();
    }, []);

    return (
        <div>
            <h1>Account</h1>
            {user && (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                </div>
            )}
        </div>
    );
}

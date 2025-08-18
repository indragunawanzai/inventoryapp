import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config/config';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
    const { setAuth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [open, setOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const [errorMessage, setErrorMessage] = useState('');
    const handleLogin = async () => {
        try {
            const body = {
                email: formData.email,
                password: formData.password,
            }

            const url = `${BASE_URL}/auth/login`;
            const response = await axios.post(url, body);
            if (response.data) {
                const token = response.data.data.token;
                const role = response.data.data.role;

                localStorage.setItem("authToken", token);
                setAuth(token, role);

                navigate('/');
                setOpen(true);
            }
        } catch (error) {
            console.log("Failed login", error.response);
            setErrorMessage(error.response.data);
            setOpen(true);
        }
    }

    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '40px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '400',
                        color: '#666',
                        textAlign: 'center',
                        marginBottom: '40px',
                        marginTop: '0'
                    }}>
                        Login
                    </h1>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter email address"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: errors.email ? '1px solid #f44336' : '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px',
                                color: '#333',
                                backgroundColor: 'white',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => {
                                if (!errors.email) {
                                    e.target.style.borderColor = '#2196F3';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.1)';
                                }
                            }}
                            onBlur={(e) => {
                                if (!errors.email) {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        />
                        {errors.email && (
                            <div style={{
                                color: '#f44336',
                                fontSize: '14px',
                                marginTop: '4px'
                            }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Enter password"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: errors.password ? '1px solid #f44336' : '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '16px',
                                color: '#333',
                                backgroundColor: 'white',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => {
                                if (!errors.password) {
                                    e.target.style.borderColor = '#2196F3';
                                    e.target.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.1)';
                                }
                            }}
                            onBlur={(e) => {
                                if (!errors.password) {
                                    e.target.style.borderColor = '#ddd';
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        />
                        {errors.password && (
                            <div style={{
                                color: '#f44336',
                                fontSize: '14px',
                                marginTop: '4px'
                            }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '32px' }}>
                        <button
                            onClick={handleLogin}
                            style={{
                                backgroundColor: '#2196F3',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '4px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s, transform 0.1s',
                                boxShadow: '0 2px 4px rgba(33, 150, 243, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1976D2';
                                e.target.style.boxShadow = '0 4px 8px rgba(33, 150, 243, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#2196F3';
                                e.target.style.boxShadow = '0 2px 4px rgba(33, 150, 243, 0.2)';
                            }}
                            onMouseDown={(e) => {
                                e.target.style.transform = 'translateY(1px)';
                            }}
                            onMouseUp={(e) => {
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Login
                        </button>
                    </div>

                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert
                            onClose={handleClose}
                            severity={errorMessage.success ? "success" : "warning"}
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {errorMessage.message}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
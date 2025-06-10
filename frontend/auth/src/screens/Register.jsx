import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'sonner';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('Please fill all fields');
            setError('All fields are required.');
            return;
        }

        try {
            const response = await api.post('/auth/register', { name, email, password });
            console.log('response', response)
            if (response.data.success === 'true') {
                toast.success('Registration successful!');
                navigate('/login');
            } else {
                console.error('Registration failed:', response.data.message);
                toast.error(response?.data?.message || 'Registration failed.');
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-gray-800">
            <div className="bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => { setName(e.target.value); setError(''); }}
                                
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Register
                        </button>
                    </form>
                     {/* Login Link */}
                     <p className="text-sm text-center mt-4">
                        Already have an account? 
                        <span 
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => navigate('/login')}
                        > Login</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

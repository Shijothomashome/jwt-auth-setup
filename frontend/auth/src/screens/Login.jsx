import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'sonner';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please enter email and password');
            setError('Please enter email and password.');
            return;
        }
        try {
            const response = await api.post('/login', { email, password });
            if (response.data.success === 'true') {
                toast.success('Login successful!');
                navigate('/home', { state: { name: response.data?.user?.name } });
            } else {
                console.error('Login failed:', response.data.message);
                toast.error(response.data.message || 'Login failed', { duration: 3000 });
            }
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen w-full bg-gray-800">
            <div className="bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="text"
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
                            Login
                        </button>
                    </form>

                    {/* Register Link */}
                    <p className="text-sm text-center mt-4">
                        Don't have an account? 
                        <span 
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => navigate('/register')}
                        > Register</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

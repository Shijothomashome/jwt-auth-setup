import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import { toast } from 'sonner';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    // Redirect to the login page on logout
    try {
      const response = await api.post('/logout')
      if(response.data.success === 200){
        toast.success( response.data.message || 'Logged out successfully.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
    
    navigate('/login');
  };

  useEffect( () => {

    const fetchUsers = async() => {
      try {
        setLoading(true);
        const response = await api.get('/users');
        if (response.data.success === 'true') {
          setUsers(response.data.users);
        }
      } catch (error) {
        console.error('Error while fetching users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-items-start mt-10 space-y-4">
        <h2 className="text-3xl text-gray-800">Home</h2>
        <p className="text-lg text-gray-600">
          Welcome, {location.state?.name || 'Guest'}!
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className='px-10 mt-10'>
        <h3 className="text-2xl text-gray-800 mb-2">Available users</h3>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ol className='list-decimal'>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((user) => (
                <li key={user.id}>{user.name} - {user.email}</li>
            )))
            }
          </ol>
        )}
      </div>
    </>

  );
};

export default Home;

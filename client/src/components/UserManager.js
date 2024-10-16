import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './UserManager.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      await api.post('/users', newUser);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <input
        type="text"
        name="username"
        value={newUser.username}
        onChange={handleInputChange}
        placeholder="Username"
        required
      />
      <input
        type="email"
        name="email"
        value={newUser.email}
        onChange={handleInputChange}
        placeholder="Email"
        required
      />
      <button onClick={handleAddUser}>Add User</button>
      <h3>User List</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default UserManager;

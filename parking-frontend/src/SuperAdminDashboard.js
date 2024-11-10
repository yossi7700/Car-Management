
import React, { useEffect, useState } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './SuperAdminDashboard.css'; // Import the CSS file
import logo from './assets/logo.png'; // Update the path as necessary
import coverPhoto from './assets/coverPhoto.png'; // Update the path as necessary

const SuperAdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [selectedRoles, setSelectedRoles] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (username, role) => {
    setSelectedRoles((prevRoles) => ({
      ...prevRoles,
      [username]: role,
    }));
  };

  const handleApprove = async (username) => {
    const role = selectedRoles[username] || 'user';
    const token = localStorage.getItem('token');
    try {
      await api.post(
        `/approve-signup/${username}`,
        { role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(users.map((user) => (user.username === username ? { ...user, approved: true } : user)));
    } catch (err) {
      setError('Error approving user');
    }
  };

  const handleDeny = async (username) => {
    const token = localStorage.getItem('token');
    try {
      await api.post(`/deny-signup/${username}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map((user) => (user.username === username ? { ...user, approved: false } : user)));
    } catch (err) {
      setError('Error denying user');
    }
  };

  const handleRemove = async (username) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.username !== username));
    } catch (err) {
      setError('Error removing user');
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...users].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return '↕'; // Default arrow for sortable columns
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { text: 'Search Car', action: () => navigate('/') },
    { text: 'Add Car', action: () => navigate('/add-car') },
    { text: 'List of All Cars', action: () => navigate('/car-list') },
    { text: 'Super Admin Dashboard', action: () => navigate('/superadmin') },
    { text: 'Logout', action: handleLogout },
  ];

  return (
    <div className="superadmin-dashboard-container">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Super Admin Dashboard
          </Typography>
          <img src={logo} alt="Logo" className="logo-appbar" />
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                item.action();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <img src={coverPhoto} alt="Cover" className="cover-photo" />

      <h2>User Management</h2>
      {error && <p className="error-message">{error}</p>}
      {users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('username')}>
                Username {getSortArrow('username')}
              </th>
              <th onClick={() => handleSort('role')}>
                Role {getSortArrow('role')}
              </th>
              <th onClick={() => handleSort('approved')}>
                Status {getSortArrow('approved')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.username}
                className={index % 2 === 0 ? 'row-white' : 'row-gray'}
              >
                <td>{user.username}</td>
                <td>
                  <div className="role-dropdown-container">
                    <select
                      className="role-dropdown"
                      onChange={(e) =>
                        handleRoleChange(user.username, e.target.value)
                      }
                      value={selectedRoles[user.username] || user.role}
                    >
                      <option value="user">User</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                  </div>
                </td>
                <td
                  className={
                    user.approved ? 'status-active' : 'status-inactive'
                  }
                >
                  {user.approved ? 'Active' : 'Inactive'}
                </td>
                <td>
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(user.username)}
                  >
                    Activate
                  </button>
                  <button
                    className="deny-button"
                    onClick={() => handleDeny(user.username)}
                  >
                    Deactivate
                  </button>
                  <button
                    className="remove-button"
                    onClick={() => handleRemove(user.username)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users available.</p>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    } else {
      localStorage.removeItem('tasks');
    }
  }, [tasks]);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleAddTask = () => {
    const trimmedInput = input.trim();
    
    if (trimmedInput === '') {
      showNotification('⚠️ Please enter a task before adding!', 'error');
      return;
    }

    if (trimmedInput.length > 100) {
      showNotification('⚠️ Task is too long. Keep it under 100 characters.', 'error');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setInput('');
    showNotification('✅ Task added successfully!', 'success');
  };

  const handleDeleteTask = (id) => {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
    showNotification('🗑️ Task deleted', 'info');
  };

  const handleToggleComplete = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <div className="App">
      {/* Glassmorphism Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-logo">📝 TodoPro</h1>
          <div className="nav-links">
            <span className="nav-link">By Sophonie Graham</span>
          </div>
        </div>
      </nav>

      {/* Toast Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="container">
        <div className="hero-section">
          <h1 className="title">My Task Manager</h1>
          <p className="subtitle">Stay organized and productive 🚀</p>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat">
            <span className="stat-number">{tasks.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Input Section */}
        <div className="input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done?"
            className="task-input"
            maxLength="100"
          />
          <button onClick={handleAddTask} className="add-button">
            <span>+</span> Add Task
          </button>
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tasks yet</h3>
              <p>Add your first task to get started!</p>
            </div>
          ) : (
            <ul className="tasks-list">
              {tasks.map((task) => (
                <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-button"
                    aria-label="Delete task"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ by Sophonie Graham | © 2025</p>
      </footer>
    </div>
  );
}

export default App;
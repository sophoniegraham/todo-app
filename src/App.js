import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const categories = ['Work', 'Personal', 'Urgent'];
  const categoryColors = {
    Work: '#0EA5E9',
    Personal: '#8B5CF6',
    Urgent: '#EF4444'
  };

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
      category: category,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setInput('');
    showNotification(`✅ Task added to ${category}!`, 'success');
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

  // Filter tasks based on search query and category filter
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const active = total - completed;
    return { total, completed, active };
  };

  const getCategoryCount = (cat) => {
    return tasks.filter(t => t.category === cat && !t.completed).length;
  };

  const stats = getTaskStats();

  return (
    <div className="App">
      {/* Glassmorphism Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="nav-logo">📋 TaskMaster Pro</h1>
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
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.active}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Category Selector */}
        <div className="category-selector">
          <label className="category-label">Category:</label>
          <div className="category-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`category-btn ${category === cat ? 'active' : ''}`}
                style={{
                  borderColor: category === cat ? categoryColors[cat] : 'transparent',
                  color: category === cat ? categoryColors[cat] : 'var(--text-secondary)'
                }}
              >
                <span className="category-dot" style={{ background: categoryColors[cat] }}></span>
                {cat}
                <span className="category-count">{getCategoryCount(cat)}</span>
              </button>
            ))}
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

        {/* Search and Filter Section */}
        <div className="filter-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="search-input"
            />
          </div>
          <div className="filter-buttons">
            <button
              onClick={() => setFilterCategory('All')}
              className={`filter-btn ${filterCategory === 'All' ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                style={{
                  borderColor: filterCategory === cat ? categoryColors[cat] : 'transparent'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>{searchQuery || filterCategory !== 'All' ? 'No matching tasks' : 'No tasks yet'}</h3>
              <p>{searchQuery || filterCategory !== 'All' ? 'Try a different search or filter' : 'Add your first task to get started!'}</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                  <div className="task-header">
                    <div className="task-category-badge" style={{ background: categoryColors[task.category] }}>
                      {task.category}
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="delete-button"
                      aria-label="Delete task"
                    >
                      ❌
                    </button>
                  </div>
                  <div className="task-body">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="task-checkbox"
                    />
                    <span className="task-text">{task.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Built with ❤️ by Sophonie Graham | © 2026</p>
      </footer>
    </div>
  );
}

export default App;
import React, { createContext, useContext, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  Outlet,
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import './App.css';

// --- AUTH CONTEXT & PROTECTED ROUTE ---
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); 
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// --- TASK CONTEXT ---
const TaskContext = createContext();

const INITIAL_TASKS = [
  {
    id: '1',
    header: 'Complete Calculus Chapter 4',
    description: 'Solve all odd-numbered problems from page 120 to 135.',
    priority: 'High',
    category: 'Academic',
    raisedAt: '19 Aug 2026, 09:30 AM',
    dueDate: '2026-08-28',
    status: 'Pending'
  },
  {
    id: '2',
    header: 'Weekly Grocery Shopping',
    description: 'Buy fresh vegetables, fruits, and household essentials.',
    priority: 'Medium',
    category: 'Personal',
    raisedAt: '18 Aug 2026, 05:15 PM',
    dueDate: '2026-08-25',
    status: 'Closed'
  },
  {
    id: '3',
    header: 'Prepare React Routing Slides',
    description: 'Draft initial outline for nested routes and dynamic URL parameters.',
    priority: 'High',
    category: 'Academic',
    raisedAt: '19 Aug 2026, 11:00 AM',
    dueDate: '2026-08-28',
    status: 'Raised'
  }
];

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = (newTask) => {
    const taskObj = {
      ...newTask,
      id: Date.now().toString(),
      raisedAt: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Raised'
    };
    setTasks((prev) => [taskObj, ...prev]);
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

const useTasks = () => useContext(TaskContext);

// --- NAVIGATION BAR ---
function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">📌 TaskManager Pro</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => (isActive ? 'active' : '')}>
          Tasks List
        </NavLink>
        <NavLink to="/add-task" className={({ isActive }) => (isActive ? 'active' : '')}>
          + Add Task
        </NavLink>
        <NavLink to="/completed" className={({ isActive }) => (isActive ? 'active' : '')}>
          Completed Tasks
        </NavLink>
      </div>
      <div className="nav-auth">
        {isAuthenticated ? (
          <button className="auth-btn logout" onClick={logout}>
            Logout
          </button>
        ) : (
          <NavLink to="/login" className="auth-btn login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

// --- PAGES ---

// 1. Dashboard Page
function Dashboard() {
  const { tasks } = useTasks();

  const total = tasks.length;
  const pending = tasks.filter((t) => t.status !== 'Closed').length;
  const closed = tasks.filter((t) => t.status === 'Closed').length;
  const highPriority = tasks.filter((t) => t.priority === 'High' && t.status !== 'Closed').length;

  return (
    <div className="page-container">
      <h2>📊 Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{total}</p>
        </div>
        <div className="stat-card warning">
          <h3>Pending / Raised</h3>
          <p className="stat-number">{pending}</p>
        </div>
        <div className="stat-card success">
          <h3>Closed</h3>
          <p className="stat-number">{closed}</p>
        </div>
        <div className="stat-card danger">
          <h3>High Priority Urgent</h3>
          <p className="stat-number">{highPriority}</p>
        </div>
      </div>
    </div>
  );
}

// 2. Tasks Page Layout 
function TasksLayout() {
  return (
    <div className="page-container">
      <Outlet />
    </div>
  );
}

// 2a. Task List Sub-component
function TaskList() {
  const { tasks, updateTaskStatus, deleteTask } = useTasks();
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  const filteredTasks = tasks.filter((t) => {
    const pMatch = filterPriority === 'All' || t.priority === filterPriority;
    const cMatch = filterCategory === 'All' || t.category === filterCategory;
    return pMatch && cMatch;
  });

  return (
    <div>
      <div className="page-header">
        <h2>📋 All Tasks List</h2>
        <div className="filters">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
      </div>

      <div className="task-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`task-card priority-${task.priority.toLowerCase()}`}>
            <div className="card-top">
              <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className="category-tag">{task.category}</span>
            </div>
            <h3>{task.header}</h3>
            <p className="desc-preview">{task.description}</p>

            <div className="meta-info">
              <small>📅 Due: {task.dueDate}</small>
              <small>Status: <strong>{task.status}</strong></small>
            </div>

            <div className="card-actions">
              <NavLink to={`/tasks/${task.id}`} className="view-link">
                View Details
              </NavLink>

              {task.status !== 'Closed' && (
                <button
                  className="action-btn complete-btn"
                  onClick={() => updateTaskStatus(task.id, 'Closed')}
                >
                  Mark Complete
                </button>
              )}

              <button className="action-btn delete-btn" onClick={() => deleteTask(task.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2b. Task Details Page
function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTaskStatus, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="page-container">
        <h3>⚠️ Task Not Found</h3>
        <button className="primary-btn" onClick={() => navigate('/tasks')}>
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="details-card">
      <button className="back-btn" onClick={() => navigate('/tasks')}>
        ← Back to Tasks List
      </button>

      <div className="details-header">
        <h2>{task.header}</h2>
        <span className={`badge ${task.priority.toLowerCase()}`}>{task.priority} Priority</span>
      </div>

      <div className="details-body">
        <p className="full-desc">{task.description}</p>

        <table className="details-table">
          <tbody>
            <tr>
              <td><strong>Category:</strong></td>
              <td>{task.category}</td>
            </tr>
            <tr>
              <td><strong>Current Status:</strong></td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                >
                  <option value="Raised">Raised</option>
                  <option value="Pending">Pending</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><strong>Raised Date & Time:</strong></td>
              <td>{task.raisedAt}</td>
            </tr>
            <tr>
              <td><strong>Due Date:</strong></td>
              <td>{task.dueDate}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="details-actions">
        <button
          className="delete-btn large"
          onClick={() => {
            deleteTask(task.id);
            navigate('/tasks');
          }}
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}

// 3. Add Task Page
function AddTask() {
  const navigate = useNavigate();
  const { addTask } = useTasks();

  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Academic');
  const [dueDate, setDueDate] = useState('2026-08-28');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!header || !description) return;

    addTask({ header, description, priority, category, dueDate });
    navigate('/tasks');
  };

  return (
    <div className="page-container small">
      <h2>➕ Create New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <label>Task Header / Title</label>
        <input
          type="text"
          required
          placeholder="e.g. Prepare presentation slides"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />

        <label>Task Description</label>
        <textarea
          rows="4"
          required
          placeholder="Provide detail steps..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <div className="form-row">
          <div>
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Academic">Academic</option>
              <option value="Personal">Personal</option>
            </select>
          </div>
        </div>

        <label>Due Date</label>
        <input
          type="date"
          required
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit" className="primary-btn">
          Create Task
        </button>
      </form>
    </div>
  );
}

// 4. Completed Tasks Page
function CompletedTasks() {
  const { tasks } = useTasks();
  const completedList = tasks.filter((t) => t.status === 'Closed');

  return (
    <div className="page-container">
      <h2>✅ Completed Tasks</h2>
      {completedList.length === 0 ? (
        <p>No completed tasks found.</p>
      ) : (
        <ul className="completed-list">
          {completedList.map((t) => (
            <li key={t.id} className="completed-item">
              <div>
                <h4>{t.header}</h4>
                <small>Completed category: {t.category} | Priority: {t.priority}</small>
              </div>
              <span className="status-tag closed">Closed</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 5. Login Page 
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/tasks';

  const handleLogin = () => {
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="page-container small login-box">
      <h2>🔒 Authentication Required</h2>
      <p>You need to log in to access this page.</p>
      <button className="primary-btn" onClick={handleLogin}>
        Simulate Login
      </button>
    </div>
  );
}

// --- MAIN APP ENTRYPOINT ---
export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Navbar />
            <main className="content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<TasksLayout />}>
                  <Route index element={<TaskList />} />
                  <Route path=":id" element={<TaskDetails />} />
                </Route>
                <Route path="/add-task" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
                <Route path="/completed" element={<CompletedTasks />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}
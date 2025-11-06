import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('');
  const [toast, setToast] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') params.status = filter;
      if (sort) params.sort = sort;

      const response = await taskAPI.getTasks(params);
      setTasks(response.data.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setToast({ message: 'Failed to load tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter, sort]);

  const handleCreateTask = async (formData) => {
    try {
      await taskAPI.createTask(formData);
      setIsModalOpen(false);
      setToast({ message: 'Task created successfully!', type: 'success' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setToast({ message: error.response?.data?.message || 'Failed to create task', type: 'error' });
    }
  };

  const handleUpdateTask = async (formData) => {
    try {
      await taskAPI.updateTask(selectedTask.task_id, formData);
      setIsModalOpen(false);
      setSelectedTask(null);
      setToast({ message: 'Task updated successfully!', type: 'success' });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setToast({ message: error.response?.data?.message || 'Failed to update task', type: 'error' });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(taskId);
      setToast({ message: 'Task deleted successfully', type: 'success' });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setToast({ message: error.response?.data?.message || 'Failed to delete task', type: 'error' });
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTaskStats = () => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length
    };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-primary/10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <nav className="bg-light/80 backdrop-blur-lg shadow-lg border-b-2 border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark">Task Manager</h1>
                <p className="text-xs text-gray-500">Organize your work efficiently</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-dark">{user?.name}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border-2 border-red-200 hover:bg-red-100 hover:shadow-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-90">Total Tasks</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{stats.total}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-90">To Do</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{stats.todo}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-90">In Progress</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{stats.inProgress}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium opacity-90">Completed</p>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold">{stats.done}</p>
          </div>
        </div>

        <div className="bg-light/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-dark mb-1">My Tasks</h2>
              <p className="text-gray-600">Manage and track your daily tasks</p>
            </div>
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="filter" className="block text-sm font-semibold text-dark mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filter by Status
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="all">🎯 All Tasks</option>
                <option value="To Do">📋 To Do</option>
                <option value="In Progress">⚡ In Progress</option>
                <option value="Done">✅ Done</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-dark mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
                </svg>
                Sort by Deadline
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="">🕐 Latest First</option>
                <option value="deadline_asc">📅 Deadline (Earliest)</option>
                <option value="deadline_desc">📅 Deadline (Latest)</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-primary/30 rounded-full"></div>
              <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-light/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-gray-100 text-center py-16 px-6">
            <div className="w-24 h-24 bg-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-3">No tasks yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {filter !== 'all' 
                ? `No tasks found with status "${filter}". Try changing the filter or create a new task.`
                : 'Start organizing your work by creating your first task!'
              }
            </p>
            <button
              onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default Dashboard;
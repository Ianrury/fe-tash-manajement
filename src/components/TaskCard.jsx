import { format } from 'date-fns';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'To Do':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'In Progress':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'Done':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';

  return (
    <div className="group relative bg-light rounded-2xl shadow-md hover:shadow-2xl border-2 border-gray-100 p-6 transition-all duration-300 hover:-translate-y-2 animate-fade-in">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-dark flex-1 pr-4 group-hover:text-primary transition-colors duration-200">
            {task.title}
          </h3>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            {statusConfig.icon}
            {task.status}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {task.deadline && (
          <div className={`flex items-center gap-2 mb-5 px-3 py-2 rounded-xl ${isOverdue ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50 border-2 border-gray-200'}`}>
            <svg className={`w-5 h-5 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={`text-sm font-semibold ${isOverdue ? 'text-red-700' : 'text-gray-700'}`}>
              {format(new Date(task.deadline), 'MMM dd, yyyy')}
              {isOverdue && (
                <span className="ml-2 px-2 py-0.5 bg-red-200 text-red-800 rounded-full text-xs">
                  Overdue
                </span>
              )}
            </span>
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t-2 border-gray-100">
          <button
            onClick={() => onEdit(task)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-dark bg-secondary rounded-xl hover:bg-primary hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
          <button
            onClick={() => onDelete(task.task_id)}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border-2 border-red-200 hover:bg-red-100 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
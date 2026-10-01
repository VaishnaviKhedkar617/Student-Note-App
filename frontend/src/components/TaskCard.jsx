import { Link } from "react-router-dom";

function TaskCard({ task, onDelete, onToggle }) {
  const dueDate = new Date(task.dueDate);

  const formattedDate = dueDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isOverdue =
    !task.isCompleted &&
    dueDate.getTime() <
      new Date().setHours(0, 0, 0, 0);

  return (
    <article
      className={`dashboard-task-card ${
        task.isCompleted ? "task-completed" : ""
      }`}
    >

      {/* Top */}
      <div className="dashboard-card-top">

        <span
          className={`category-badge category-${task.category.toLowerCase()}`}
        >
          {task.category}
        </span>

        <span
          className={`priority-badge priority-${task.priority.toLowerCase()}`}
        >
          {task.priority}
        </span>

      </div>

      {/* Title */}
      <h3
        className={
          task.isCompleted
            ? "completed-title"
            : ""
        }
      >
        {task.title}
      </h3>

      {/* Description */}
      <p className="dashboard-task-description">
        {task.description ||
          "No description provided."}
      </p>

      {/* Details */}
      <div className="dashboard-task-info">

        <div className="task-info-item">
          <span className="info-label">
            Due Date
          </span>

          <strong>
            📅 {formattedDate}
          </strong>
        </div>

        <div className="task-info-item">
          <span className="info-label">
            Status
          </span>

          {isOverdue ? (
            <span className="status-badge overdue-badge">
              Overdue
            </span>
          ) : task.isCompleted ? (
            <span className="status-badge completed-badge">
              Completed
            </span>
          ) : (
            <span className="status-badge pending-badge">
              Pending
            </span>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="dashboard-task-actions">

        <Link
          to={`/task/${task._id}`}
          className="task-action view-action"
        >
          View
        </Link>

        <Link
          to={`/edit-task/${task._id}`}
          className="task-action edit-action"
        >
          Edit
        </Link>

        <button
          type="button"
          className="task-action complete-action"
          onClick={() => onToggle(task)}
        >
          {task.isCompleted
            ? "Mark Pending"
            : "Complete"}
        </button>

        <button
          type="button"
          className="task-action delete-action"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>

      </div>

    </article>
  );
}

export default TaskCard;
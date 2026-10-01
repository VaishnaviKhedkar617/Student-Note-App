
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteTask, getTask, updateTask } from "../api";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      try {
        const data = await getTask(id);

        if (!cancelled) {
          setTask(data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load task.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTask();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleToggle = async () => {
    try {
      const updated = await updateTask(id, {
        isCompleted: !task.isCompleted,
      });

      setTask(updated);
    } catch (err) {
      setError(err.message || "Unable to update task.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(id);
      navigate("/");
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  };

  if (loading) {
    return (
      <div className="state-box">
        <div className="spinner" />
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="state-box">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="button button-light">Back to dashboard</Link>
      </div>
    );
  }

  if (!task) return null;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not available";

  return (
    <div className="details-page">
      <Link to="/" className="back-link">← Back to dashboard</Link>

      {error && <div className="alert alert-error">{error}</div>}

      <article className="details-card">
        <div className="details-top">
          <span className={`category-badge category-${task.category.toLowerCase()}`}>
            {task.category}
          </span>

          <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
            {task.priority} priority
          </span>
        </div>

        <h1>{task.title}</h1>

        <div className="status-banner">
          <span className={`status-dot ${task.isCompleted ? "dot-completed" : "dot-pending"}`} />
          {task.isCompleted ? "Task completed" : "Task pending"}
        </div>

        <div className="detail-section">
          <h3>Description</h3>
          <p className="detail-description">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span>📂 Category</span>
            <strong>{task.category}</strong>
          </div>

          <div className="detail-item">
            <span>🎯 Priority</span>
            <strong>{task.priority}</strong>
          </div>

          <div className="detail-item">
            <span>📅 Due date</span>
            <strong>{formatDate(task.dueDate)}</strong>
          </div>

          <div className="detail-item">
            <span>✓ Status</span>
            <strong>{task.isCompleted ? "Completed" : "Pending"}</strong>
          </div>

          <div className="detail-item">
            <span>🕒 Created</span>
            <strong>{formatDate(task.createdAt)}</strong>
          </div>

          <div className="detail-item">
            <span>🔄 Last updated</span>
            <strong>{formatDate(task.updatedAt)}</strong>
          </div>
        </div>

        <div className="details-actions">
          <Link to={`/edit-task/${task._id}`} className="button button-primary">
            Edit task
          </Link>

          <button
            className="button button-success"
            onClick={handleToggle}
          >
            {task.isCompleted ? "Mark pending" : "Mark completed"}
          </button>

          <button
            className="button button-danger"
            onClick={handleDelete}
          >
            Delete task
          </button>
        </div>
      </article>
    </div>
  );
}

export default TaskDetails;
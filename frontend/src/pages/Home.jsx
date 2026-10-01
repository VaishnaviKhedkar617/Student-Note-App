import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TaskCard from "../components/TaskCard";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/tasks"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      fetchTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggle = async (task) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...task,
            isCompleted: !task.isCompleted,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      fetchTasks();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-state">
        <div className="loading-spinner"></div>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state error-state">
        <h2>Something went wrong</h2>
        <p>{error}</p>

        <button
          type="button"
          className="dashboard-button primary-button"
          onClick={fetchTasks}
        >
          Try Again
        </button>
      </div>
    );
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.isCompleted
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.isCompleted
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" && !task.isCompleted
  ).length;

  return (
    <div className="dashboard">

      {/* Dashboard Header */}
      <div className="dashboard-top">

        <div>
          <p className="dashboard-small-title">
            STUDENT TASK PLANNER
          </p>

          <h1>Student Task Planner</h1>

          <p className="dashboard-description">
            Manage your tasks, assignments and study schedule.
          </p>
        </div>

        <Link
          to="/add-task"
          className="dashboard-button primary-button"
        >
          + Add New Task
        </Link>

      </div>

      {/* Statistics */}
      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon blue-icon">
            📋
          </div>

          <div>
            <p>Total Tasks</p>
            <h2>{totalTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon orange-icon">
            ⏳
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon green-icon">
            ✓
          </div>

          <div>
            <p>Completed</p>
            <h2>{completedTasks}</h2>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon red-icon">
            !
          </div>

          <div>
            <p>High Priority</p>
            <h2>{highPriorityTasks}</h2>
          </div>
        </div>

      </div>

      {/* Tasks Section */}
      <div className="dashboard-task-header">

        <div>
          <h2>Your Tasks</h2>

          <p>
            {totalTasks} task
            {totalTasks !== 1 ? "s" : ""} available
          </p>
        </div>

        <button
          type="button"
          className="refresh-button"
          onClick={fetchTasks}
        >
          ↻ Refresh
        </button>

      </div>

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="dashboard-empty">

          <div className="empty-icon">
            📋
          </div>

          <h2>No tasks found</h2>

          <p>
            Start by creating your first task.
          </p>

          <Link
            to="/add-task"
            className="dashboard-button primary-button"
          >
            + Create Task
          </Link>

        </div>
      ) : (
        <div className="dashboard-task-grid">

          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}

        </div>
      )}

    </div>
  );
}

export default Home;

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { getTask, updateTask } from "../api";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      try {
        setLoading(true);
        setError("");

        const data = await getTask(id);

        if (!cancelled) {
          setTask(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load this task.");
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

  const handleUpdate = async (formData) => {
    await updateTask(id, formData);
    navigate(`/task/${id}`);
  };

  if (loading) {
    return <div className="state-box"><div className="spinner" /><p>Loading task...</p></div>;
  }

  if (error) {
    return (
      <div className="state-box">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="button button-light">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="form-page">
      <Link to={`/task/${id}`} className="back-link">← Back to task</Link>

      <div className="form-heading">
        <span className="eyebrow">EDIT TASK</span>
        <h1>Update your task</h1>
        <p>Change the task details and save your updates.</p>
      </div>

      <div className="form-card">
        <TaskForm
          key={task._id}
          initialData={task}
          onSubmit={handleUpdate}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}

export default EditTask;
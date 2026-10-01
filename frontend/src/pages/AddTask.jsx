
import { Link, useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import { createTask } from "../api";

function AddTask() {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    await createTask(formData);
    navigate("/");
  };

  return (
    <div className="form-page">
      <Link to="/" className="back-link">← Back to dashboard</Link>

      <div className="form-heading">
        <span className="eyebrow">NEW TASK</span>
        <h1>Create a task</h1>
        <p>Enter the details to add a task to your study planner.</p>
      </div>

      <div className="form-card">
        <TaskForm
          onSubmit={handleCreate}
          submitLabel="Create task"
        />
      </div>
    </div>
  );
}

export default AddTask;
import { useState } from "react";

function TaskForm({ initialData, onSubmit, submitLabel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "Study",
    priority: initialData?.priority || "Medium",
    dueDate: initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : "",
    isCompleted: initialData?.isCompleted || false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
    } catch (err) {
      setError(err.message || "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">
          Task Title *
        </label>

        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">
          Description *
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="5"
          required
        />
      </div>

      {/* Category and Priority */}
      <div className="form-row">

        <div className="form-group">
          <label htmlFor="category">
            Category *
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Study">Study</option>
            <option value="Assignment">Assignment</option>
            <option value="Exam">Exam</option>
            <option value="Personal">Personal</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">
            Priority *
          </label>

          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

      </div>

      {/* Due Date */}
      <div className="form-group">
        <label htmlFor="dueDate">
          Due Date *
        </label>

        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
      </div>

      {/* Completed */}
      <label className="checkbox-row">
        <input
          type="checkbox"
          name="isCompleted"
          checked={formData.isCompleted}
          onChange={handleChange}
        />

        Mark this task as completed
      </label>

      {/* Submit */}
      <div className="form-actions">
        <button
          type="submit"
          className="button button-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>

    </form>
  );
}

export default TaskForm;


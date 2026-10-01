
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the server. Make sure your backend is running."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = data.errors?.join(", ");
    throw new Error(
      validationErrors || data.message || "Something went wrong."
    );
  }

  return data;
}

export const getTasks = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.set(key, value);
    }
  });

  const query = params.toString();

  return request(`/tasks${query ? `?${query}` : ""}`);
};

export const getTask = (id) =>
  request(`/tasks/${id}`);

export const createTask = (task) =>
  request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

export const updateTask = (id, task) =>
  request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, {
    method: "DELETE",
  });
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    tTitle: "",
    tDesc: "",
    tStatus: "pending",
    priority: "Medium",
    tAssignedTo: [],
  });

  // Add a new task
  const handleAddTask = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/tasks/add", newTask);
      const addedTask = response.data.task;
      setTasks((prevTasks) => [addedTask, ...prevTasks]);
      setNewTask({
        tTitle: "",
        tDesc: "",
        tStatus: "pending",
        priority: "Medium",
        tAssignedTo: [],
      });
      setShowForm(false);
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/api/tasks/");
      const sortedTasks = response.data.tasks.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTasks(sortedTasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for a task
  const fetchComments = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${taskId}/comments`);
      const sortedComments = response.data.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  // Handle task selection
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    fetchComments(task._id);
  };

  // Add a comment to the selected task
  const handleAddComment = async () => {
    try {
      if (newComment.trim()) {
        await axios.post(`http://localhost:4000/tasks/${selectedTask._id}/comments`, {
          comment: newComment,
        });
        setNewComment("");
        fetchComments(selectedTask._id);
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="task-container" style={{ backgroundColor: "#D3B7FF" }}>
      {!selectedTask ? (
        <div className="task-list">
          <h2 className="heading">Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            <span className="mr-2 text-lg">+</span> Add Task
          </button>

          {showForm && (
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.tTitle}
                onChange={(e) => setNewTask({ ...newTask, tTitle: e.target.value })}
              />
              <textarea
                placeholder="Task Description"
                value={newTask.tDesc}
                onChange={(e) => setNewTask({ ...newTask, tDesc: e.target.value })}
              />
              <button onClick={handleAddTask} className="submit-task-button">
                Submit
              </button>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : (
            <div className="task-items">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="task-card"
                  onClick={() => handleTaskClick(task)}
                >
                  <h3 className="task-title">{task.tTitle}</h3>
                  <p className="task-desc">{task.tDesc}</p>
                  <div className="task-meta">
                    <span>Priority: {task.priority}</span>
                    <span>{new Date(task.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="task-detail">
          <button className="back-button" onClick={() => setSelectedTask(null)}>
            Back to Tasks
          </button>
          <h2 className="detail-title">{selectedTask.tTitle}</h2>
          <p className="detail-desc">{selectedTask.tDesc}</p>
          <div className="comments-section">
            {comments.map((comment, index) => (
              <div
                key={index}
                className={`comment-item ${index % 2 === 0 ? "left" : "right"}`}
              >
                <p className="comment-text">{comment.text}</p>
                <span className="comment-time">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="add-comment">
            <textarea
              className="comment-input"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="add-button" onClick={handleAddComment}>
              Add Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;

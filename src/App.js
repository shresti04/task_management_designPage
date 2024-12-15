import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Task from "./task"; // Import your Task component
import './App.css';
// import '../tailwind.config';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect the root path to the task page */}
        <Route path="/" element={<Navigate to="/task" />} />
        <Route path="/task" element={<Task />} />
      </Routes>
    </Router>
  );
}

export default App;

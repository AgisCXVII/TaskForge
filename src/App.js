import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskTimeFrame, setTaskTimeFrame] = useState("");
  const [taskColor, setTaskColor] = useState("#000000");
  const [taskNotes, setTaskNotes] = useState("");
  const [hover, setHover] = useState(false);

  const handleAddTask = () => {
    if (taskText.trim() === "") return;
    const newTask = {
      text: taskText,
      timeFrame: taskTimeFrame,
      color: taskColor,
      notes: taskNotes,
      timer: parseTime(taskTimeFrame),
      completed: false // Initial state for completion
    };
    setTasks([...tasks, newTask]);
    setTaskText("");
    setTaskTimeFrame("");
    setTaskColor("#000000");
    setTaskNotes("");
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((task, i) => i !== index);
    setTasks(newTasks);
  };

  const handleCompleteTask = (index) => {
    const newTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const parseTime = (timeFrame) => {
    let totalSeconds = 0;
    const timeRegex = /(\d+)\s*(s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)/gi;
    let match;

    while ((match = timeRegex.exec(timeFrame)) !== null) {
      const value = parseInt(match[1], 10);
      const unit = match[2].toLowerCase();

      switch (unit) {
        case 's':
        case 'sec':
        case 'secs':
        case 'second':
        case 'seconds':
          totalSeconds += value;
          break;
        case 'm':
        case 'min':
        case 'mins':
        case 'minute':
        case 'minutes':
          totalSeconds += value * 60;
          break;
        case 'h':
        case 'hr':
        case 'hrs':
        case 'hour':
        case 'hours':
          totalSeconds += value * 3600;
          break;
        case 'd':
        case 'day':
        case 'days':
          totalSeconds += value * 86400;
          break;
        default:
          break;
      }
    }

    return totalSeconds;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(tasks.map(task => {
        if (task.timer > 0 && !task.completed) {
          return {
            ...task,
            timer: task.timer - 1
          };
        }
        return task;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="App">
      <h1>TaskForge</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter a task"
        />
        <input
          type="text"
          value={taskTimeFrame}
          onChange={(e) => setTaskTimeFrame(e.target.value)}
          placeholder="Enter time frame (e.g., 2h, 30m, 120s, 1d)"
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
        />
        <input
          type="color"
          value={taskColor}
          onChange={(e) => setTaskColor(e.target.value)}
        />
        <textarea
          value={taskNotes}
          onChange={(e) => setTaskNotes(e.target.value)}
          placeholder="Enter notes about this task"
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {hover && (
        <div className="instructions">
          <p>Enter time in formats like "2h", "30m", "120s", "1d".</p>
        </div>
      )}

      <ul>
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''}>
            <span className="task-color" style={{ backgroundColor: task.color }}></span>
            <div className="task-details">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCompleteTask(index)}
                className="complete-checkbox"
              />
              <span className="task-text">{task.text}</span>
              <span className="separator"> | </span>
              <span className="task-time">{task.timeFrame}</span>
              {task.timer > 0 && (
                <>
                  <span className="separator"> | </span>
                  <span className="task-timer">Timer: {Math.floor(task.timer / 3600)}h {Math.floor((task.timer % 3600) / 60)}m {task.timer % 60}s</span>
                </>
              )}
              {task.notes && (
                <>
                  <div className="task-separator"></div>
                  <div className="task-notes">
                    <strong>Note:</strong> {task.notes}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => handleDeleteTask(index)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";

import axios from "axios";

const presetColors = [
    "#eee2df", 
    "#eed7c5", 
    "#e9f5db", 
    "#cad2c5", 
    "#b4becf", 
    "#e4c1f9", 
    "#d8e2dc", 
    "#fcd5ce", 
    "#bad4aa", 
    "#abc4ff", 
    "#8a7968", 
    "#90a8c3", 
    "#fef9ef", 
    "#cfbaf0", 
    "#ffc2d1", 
  ];
  

const Sidebar = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [goalColor, setGoalColor] = useState(""); // Assigned from preset list
  const [tasks, setTasks] = useState([""]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [CreateGoal, setCreateGoal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);

  const toggleGoal = (id) => {
    setSelectedGoalId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    fetchGoals();
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? "hidden" : "auto";
  }, [sidebarOpen, isMobile]);

  const fetchGoals = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_BASE}/goals`);
    const allGoals = await Promise.all(
      res.data.map(async (goal) => {
        const taskRes = await axios.get(
          `${process.env.REACT_APP_API_BASE}/tasks?goalId=${goal._id}`
        );
        return { ...goal, tasks: taskRes.data };
      })
    );
    setGoals(allGoals);
  };

  const handleAddTaskField = () => setTasks([...tasks, ""]);
  const handleRemoveTaskField = (index) =>
    setTasks(tasks.filter((_, i) => i !== index));
  const handleTaskChange = (index, value) => {
    const updated = [...tasks];
    updated[index] = value;
    setTasks(updated);
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!goalName.trim() || tasks.every((t) => t.trim() === "")) return;

    const colorIndex = goals.length % presetColors.length;
    const selectedColor = presetColors[colorIndex];

    const goalRes = await axios.post(`${process.env.REACT_APP_API_BASE}/goals`, {
      name: goalName.trim(),
      color: selectedColor,
    });

    const goalId = goalRes.data._id;

    await Promise.all(
      tasks
        .filter((t) => t.trim() !== "")
        .map((name) =>
          axios.post(`${process.env.REACT_APP_API_BASE}/tasks`, { name, goalId })
        )
    );

    setGoalName("");
    setGoalColor("");
    setTasks([""]);
    fetchGoals();
    setCreateGoal(false)
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      const tasksRes = await axios.get(
        `${process.env.REACT_APP_API_BASE}/tasks?goalId=${goalId}`
      );
      await Promise.all(
        tasksRes.data.map((task) =>
          axios.delete(`${process.env.REACT_APP_API_BASE}/tasks/${task._id}`)
        )
      );
      await axios.delete(`${process.env.REACT_APP_API_BASE}/goals/${goalId}`);
      fetchGoals();
      setSelectedGoalId(null); 
    } catch (err) {
      console.error("Error deleting goal:", err);
    }
  };
  const navStyle = {
    width: "100%",
    backgroundColor: "#343a40",
    // padding: "10px",
    height:'50px',
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1001,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const toggleButtonStyle = {
    position: "absolute",
    left: '15px',
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1100,
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "20px",
    cursor: "pointer",
    display: isMobile ? "block" : "none",
  };

  const containerStyle = {
    position: isMobile ? "fixed" : "relative",
    // top: "50px",
    left: 0,
    height: "100%",
    width: isMobile ? "250px" : "100%",
    backgroundColor: "#f9f9f9",
    boxShadow: sidebarOpen ? "2px 0 6px rgba(0,0,0,0.15)" : "none",
    padding: sidebarOpen ? "20px" : "0",
    overflowY: "auto",
    transition: "transform 0.3s ease-in-out",
    transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
    zIndex: 1000,
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    display: isMobile && sidebarOpen ? "block" : "none",
  };

  const inputStyle = {
    width: "90%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    fontSize: "14px",
  };

  const buttonStyle = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  };

  return (
    <>
      <div style={navStyle}>
        {isMobile && (
          <button
            style={toggleButtonStyle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        )}
        <h4 style={{ margin: 0 }}>My Calendar</h4>
        
      </div>

      {isMobile && sidebarOpen && (
        <div style={overlayStyle} onClick={() => setSidebarOpen(false)} />
      )}

      <div style={containerStyle}>
        {sidebarOpen && (
          <>
            <div
              style={{
                maxWidth: "500px",
                margin: "40px auto",
                fontFamily: "sans-serif",
              }}
            >
              <div
                onClick={() => setCreateGoal((prev) => !prev)}
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#2c3e50",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "background 0.3s",
                }}
              >
                {CreateGoal ? "Close " : "Create Goal"}
              </div>

              {CreateGoal && (
                <form
                  onSubmit={handleGoalSubmit}
                  style={{
                    marginTop: "20px",
                    padding: "20px",
                    borderRadius: "12px",
                    background: "#fff",
                    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    placeholder="Goal name"
                    style={inputStyle}
                    required
                  />

                  <div style={{ marginTop: "16px" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        display: "block",
                      }}
                    >
                      Tasks:
                    </label>
                    {tasks.map((task, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "10px",
                        }}
                      >
                        <input
                          type="text"
                          placeholder={`Task ${idx + 1}`}
                          value={task}
                          onChange={(e) =>
                            handleTaskChange(idx, e.target.value)
                          }
                          style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTaskField(idx)}
                          style={{
                            ...buttonStyle,
                            backgroundColor: "#e74c3c",
                            color: "#fff",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddTaskField}
                      style={{
                        ...buttonStyle,
                        backgroundColor: "#3498db",
                        color: "#fff",
                        marginTop: "6px",
                      }}
                    >
                      + Add Task
                    </button>
                  </div>

                  <button
                    type="submit"
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#2ecc71",
                      color: "#fff",
                      marginTop: "20px",
                      width: "100%",
                    }}
                  >
                    Save Goal + Tasks
                  </button>
                </form>
              )}
            </div>

            <hr style={{ margin: "24px 0" }} />

            <h3
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                marginBottom: "12px",
              }}
            >
              GOALS
            </h3>
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "20px",
                }}
              >
                { goals.map((goal) => (
                  <div
                    key={goal._id}
                    onClick={() => toggleGoal(goal._id)}
                    style={{
                      padding: "12px 16px",
                      backgroundColor: goal.color,
                      color: "black",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {goal.name}
                  </div>
                ))}
              </div>

              {selectedGoalId && (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "10px",
                    backgroundColor: "#f4f4f4",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <h3 style={{ marginBottom: "10px", fontWeight: "bold" }}>
                    TASKS
                  </h3>

                  {goals
                    .find((g) => g._id === selectedGoalId)
                    ?.tasks.map((task) => {
                      const selectedGoal = goals.find(
                        (g) => g._id === selectedGoalId
                      );

                      return (
                        <div
                          key={task._id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "application/json",
                              JSON.stringify({
                                taskName: task.name,
                                goalName: selectedGoal.name,
                                goalColor: selectedGoal.color,
                              })
                            );

                            if (isMobile) {
                              setTimeout(() => setSidebarOpen(false), 100);
                            }
                          }}
                          title="Drag to calendar"
                          style={{
                            backgroundColor: selectedGoal.color,
                            color: "black",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            cursor: "grab",
                            fontWeight: "500",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          📌 {task.name}
                        </div>
                      );
                    })}
                  <button
                    onClick={() => handleDeleteGoal(selectedGoalId)}
                    style={{
                      ...buttonStyle,
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      fontSize: "13px",
                      marginTop: "12px",
                    }}
                  >
                    Delete Goal
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <div style={{ height: "30px" }}></div>
      </div>
    </>
  );
};

export default Sidebar;

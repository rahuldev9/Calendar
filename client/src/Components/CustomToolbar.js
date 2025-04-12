import React from "react";

const CustomToolbar = ({ label, onNavigate, onView, view }) => {
  const toolbarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.06)",
    marginBottom: "1.5rem",
  };

  const labelStyle = {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#2c3e50",
    margin: "0 10px",
  };

  const buttonStyle = (isActive = false) => ({
    background: isActive
      ? "linear-gradient(135deg, #1abc9c, #16a085)"
      : "linear-gradient(135deg, #4e8cff, #5fd2ff)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    margin: "2px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: isActive
      ? "0 3px 8px rgba(0, 0, 0, 0.1)"
      : "0 2px 6px rgba(0, 0, 0, 0.12)",
  });

  const navSectionStyle = {
    display: "flex",
    alignItems: "center",

    flexWrap: "wrap",
  };

  const viewSectionStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  return (
    <div style={toolbarStyle}>
      <div style={navSectionStyle}>
        <button style={buttonStyle()} onClick={() => onNavigate("PREV")}>
          ◀
        </button>
        <span style={labelStyle}>{label}</span>
        <button style={buttonStyle()} onClick={() => onNavigate("NEXT")}>
          ➤
        </button>
      </div>
      <div style={viewSectionStyle}>
        <button style={buttonStyle()} onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button
          style={buttonStyle(view === "month")}
          onClick={() => onView("month")}
        >
          Month
        </button>
        <button
          style={buttonStyle(view === "week")}
          onClick={() => onView("week")}
        >
          Week
        </button>
        <button
          style={buttonStyle(view === "day")}
          onClick={() => onView("day")}
        >
          Day
        </button>
        <button
          style={buttonStyle(view === "agenda")}
          onClick={() => onView("agenda")}
        >
          Agenda
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;

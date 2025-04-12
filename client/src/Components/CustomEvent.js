import React from "react";
import moment from "moment";

const CustomEvent = ({ event }) => {
  const start = moment(event.start).format("h:mm A");

  const containerStyle = {
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: event.color,
    marginBottom: "10px",
  };

  const timeStyle = {
    fontSize: "10px",
    fontWeight: "bold",
    margin:'1px',
    color: "black",
  };

  const titleStyle = {
    fontSize: "10px",
    fontWeight: "bold",
    color: "black",
    margin:'1px',
  };

  const categoryStyle = {
    fontSize: "10px",
    fontWeight: "bold",
    margin:'1px',
    color: "black",
  };

  return (
    <div style={containerStyle}>
      <div style={timeStyle}>{start}</div>
      <div style={titleStyle}>{event.title}</div>
      <div style={categoryStyle}>{event.category}</div>
    </div>
  );
};

export default CustomEvent;

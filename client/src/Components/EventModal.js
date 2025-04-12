import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addEvent, updateEvent, setEvents } from "../redux/eventSlice";
import axios from "axios";

const categories = ["exercise", "eating", "work", "relax", "family", "social"];

const EventModal = ({ isOpen, closeModal, selectedEvent, slotInfo }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  const [form, setForm] = useState({
    title: "",
    category: "work",
    start: "",
    end: "",
  });

  useEffect(() => {
    if (selectedEvent) {
      setForm({
        title: selectedEvent.title,
        category: selectedEvent.category,
        textColor: "#0081a7",
        start: selectedEvent.start,
        end: selectedEvent.end,
      });
    } else if (slotInfo) {
      setForm({ ...form, start: slotInfo.start, end: slotInfo.end });
    }
  }, [selectedEvent, slotInfo]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedEvent) {
      axios
        .put(`${process.env.REACT_APP_API_BASE}events/${selectedEvent._id}`, form)
        .then((res) => {
          dispatch(updateEvent(res.data));
          closeModal();
        });
    } else {
      axios.post(`${process.env.REACT_APP_API_BASE}/events`, form).then((res) => {
        dispatch(addEvent(res.data));
        closeModal();
      });
    }
  };

  const handleDelete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_BASE}/events/${selectedEvent._id}`)
      .then(() => {
        dispatch(setEvents(events.filter((e) => e._id !== selectedEvent._id)));
        closeModal();
      });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "10px",
          width: "400px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out",
          transform: "scale(1)",
          animation: "slideIn 0.3s ease-out",
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "16px",
            color: "#333",
            textAlign: "center",
          }}
        >
          {selectedEvent ? "Edit Event" : "+ Add Event"}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <div
              style={{ marginBottom: "6px", fontWeight: "500", color: "#444" }}
            >
              {" "}
              📌 Title
            </div>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Event Title"
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                outline: "none",
                transition: "border 0.3s ease-in-out",
              }}
              required
            />
          </div>

          <div>
            <div
              style={{ marginBottom: "6px", fontWeight: "500", color: "#444" }}
            >
              {" "}
              🏷️ Category
            </div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                backgroundColor: "#fff",
                outline: "none",
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div
              style={{ marginBottom: "6px", fontWeight: "500", color: "#444" }}
            >
              {" "}
              📅 Start Time
            </div>
            <input
              type="datetime-local"
              name="start"
              value={form.start}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                outline: "none",
              }}
              required
            />
          </div>

          <div>
            <div
              style={{ marginBottom: "6px", fontWeight: "500", color: "#444" }}
            >
              ⏰ End Time
            </div>
            <input
              type="datetime-local"
              name="end"
              value={form.end}
              onChange={handleChange}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                outline: "none",
              }}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.3s",
              }}
            >
              Save
            </button>

            {selectedEvent && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  backgroundColor: "#e3342f",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  cursor: "pointer",
                  border: "none",
                  transition: "background-color 0.3s",
                }}
              >
                Delete
              </button>
            )}

            <button
              type="button"
              onClick={closeModal}
              style={{
                backgroundColor: "#e5e7eb",
                padding: "12px 20px",
                borderRadius: "8px",
                fontSize: "1rem",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.3s",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;

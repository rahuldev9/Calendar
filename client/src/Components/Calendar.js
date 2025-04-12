import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { setEvents, updateEvent } from "../redux/eventSlice";
import axios from "axios";
import EventModal from "./EventModal";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CustomEvent from "./CustomEvent";
import CustomToolbar from "./CustomToolbar";

const DnDCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const MyCalendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDropFromOutside = ({ start }) => {
    if (!draggedTask) return;

    const newStart = new Date(start);
    const newEnd = new Date(start);
    newEnd.setHours(newEnd.getHours() + 1);

    const newEvent = {
      title: draggedTask.taskName,
      category: draggedTask.goalName,
      color: draggedTask.goalColor,
      start: newStart,
      end: newEnd,
    };

    axios
      .post(`${process.env.REACT_APP_API_BASE}/events`, newEvent)
      .then((res) => {
        dispatch(setEvents([...events, res.data]));
      })
      .catch((err) => console.error("Error saving dropped event:", err));

    setDraggedTask(null);
  };

  useEffect(() => {
    const handleDragStart = (e) => {
      try {
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          setDraggedTask(JSON.parse(data));
        }
      } catch (err) {
        console.error("Drag data error:", err);
      }
    };

    window.addEventListener("dragstart", handleDragStart);
    return () => window.removeEventListener("dragstart", handleDragStart);
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE}/events`)
      .then((res) => {
        dispatch(setEvents(res.data));
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [dispatch]);

  const handleSelectSlot = (slotInfo) => {
    setSlotInfo(slotInfo);
    setSelectedEvent(null);
    setModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSlotInfo(null);
    setModalOpen(true);
  };

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };

    axios
      .put(`${process.env.REACT_APP_API_BASE}/events/${event._id}`, updatedEvent)
      .then((res) => {
        dispatch(updateEvent(res.data));
      })
      .catch((error) => {
        console.error("Error updating event:", error);
      });
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <h2
        style={{
          color: "black",
          padding: "12px",
          backgroundColor: "#64a6bd",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        Calendar
      </h2>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <DnDCalendar
          localizer={localizer}
          events={events.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }))}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color || "#F0F8FF",
              borderRadius: "6px",
              padding: "4px 8px",
              border: "none",
              borderLeft: "3px solid black",
            },
          })}
          startAccessor="start"
          endAccessor="end"
          selectable
          resizable
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
          }}
          style={{
            minHeight: "500px",
            height: "70vh",
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#ffffff",
          }}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          draggableAccessor={() => true}
          onDropFromOutside={handleDropFromOutside}
        //   dragFromOutsideItem={() => draggedTask} // ✅ This is the fix
        />
      </div>

      {modalOpen && (
        <EventModal
          isOpen={modalOpen}
          closeModal={() => setModalOpen(false)}
          selectedEvent={selectedEvent}
          slotInfo={slotInfo}
        />
      )}
    </div>
  );
};

export default MyCalendar;

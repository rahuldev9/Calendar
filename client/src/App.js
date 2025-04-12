import React, { useState, useEffect } from 'react';
import MyCalendar from './Components/Calendar';
import Sidebar from './Components/Sidebar';
import "./App.css";

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    fontFamily: 'sans-serif',
  };

  const sidebarStyle = {
    width: isMobile ? '100%' : '300px',
    height: isMobile ? 'auto' : '100%',
    borderBottom: isMobile ? '1px solid #ccc' : 'none',
    borderRight: isMobile ? 'none' : '1px solid #ccc',
    padding: '1rem',
    overflowY: 'auto',
    backgroundColor: '#f5f5f5',
  };

  const calendarStyle = {
    flex: 1,
    padding: isMobile ? '1rem' : '2rem',
    overflowY: 'auto',
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <Sidebar />
      </div>
      <div style={calendarStyle}>
        <MyCalendar />
      </div>
    </div>
  );
}

export default App;

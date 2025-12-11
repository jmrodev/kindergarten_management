import React, { useState } from 'react';
import './CalendarView.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: '2025-01-15', title: 'Reunión de Padres', type: 'evento' },
    { id: 2, date: '2025-01-20', title: 'Fiesta de Fin de Año', type: 'celebracion' },
    { id: 3, date: '2025-01-22', title: 'Día sin Clases', type: 'feriado' },
    { id: 4, date: '2025-01-25', title: 'Entrega de Informes', type: 'importante' },
  ]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      daysArray.push(day);
    }
    
    return daysArray;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const isEventDate = (day) => {
    if (!day) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr);
  };

  const getEventForDate = (day) => {
    if (!day) return null;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateMonth(-1)}>
          &lt;
        </button>
        <h3>{months[currentMonth]} {currentYear}</h3>
        <button className="nav-button" onClick={() => navigateMonth(1)}>
          &gt;
        </button>
      </div>
      
      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {daysInMonth.map((day, index) => {
          const hasEvent = isEventDate(day);
          const dayEvents = getEventForDate(day) || [];
          
          return (
            <div 
              key={index} 
              className={`calendar-day ${day ? 'valid-day' : ''} ${hasEvent ? 'has-event' : ''}`}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-events">
                    {dayEvents.slice(0, 2).map(event => (
                      <div key={event.id} className={`event-badge ${event.type}`}>
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="event-badge more">+{dayEvents.length - 2} más</div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="upcoming-events">
        <h4>Próximos Eventos</h4>
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className={`event-item ${event.type}`}>
              <div className="event-date">{new Date(event.date).toLocaleDateString('es-ES')}</div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
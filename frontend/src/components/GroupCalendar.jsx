import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import { useEffect, useState } from "react";

export default function GroupCalendar({ group }) {
  const styles = {
    flexGrow: "1",
    width: "90%",
    margin: "0 auto",
  };

  const [groupEvents, setGroupEvents] = useState([]);

  useEffect(() => {
    setGroupEvents(group.events);
  }, [group]);

  const addEvent = (eventData) => {
    const EVENT_URL = `/api/group/${group.id}/events`;
    httpRequest(EVENT_URL, "POST", eventData).then(() => {
      setGroupEvents([...groupEvents, eventData]);
    });
  };

  const deleteEvent = (id) => {
    const EVENT_URL = `/api/group/${group.id}/events/${id}`;
    httpRequest(EVENT_URL, "DELETE");
  };

  const editEvent = (eventData) => {
    const EVENT_URL = `/api/group/${group.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  return (
    <div style={styles}>
      <Calendar
        events={groupEvents}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

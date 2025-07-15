import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";

const styles = {
  flexGrow: "1",
  width: "90%",
  margin: "0 auto",
};

export default function GroupCalendar({ group, setGroup }) {
  const addEvent = (eventData) => {
    const EVENT_URL = `/api/group/${group.id}/events`;
    httpRequest(EVENT_URL, "POST", eventData).then(() => {
      setGroup({
        ...group,
        events: [...group.events, eventData],
      });
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
        events={group.events}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

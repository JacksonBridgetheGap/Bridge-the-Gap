import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../providers/UserProvider.jsx";
import { useContext } from "react";

export default function UserCalendar() {
  const styles = {
    flexGrow: "1",
    height: "50%",
    width: "50%",
    margin: "0 2%",
  };

  const { user } = useContext(userContext);

  const addEvent = (eventData) => {
    const EVENT_URL = `/api/user/${user.id}/events`;
    httpRequest(EVENT_URL, "POST", eventData).then(() => {});
  };

  const deleteEvent = (id) => {
    const EVENT_URL = `/api/user/${user.id}/events/${id}`;
    httpRequest(EVENT_URL, "DELETE");
  };

  const editEvent = (eventData) => {
    const EVENT_URL = `/api/user/${user.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  return (
    <div style={styles}>
      <Calendar
        events={user.events}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

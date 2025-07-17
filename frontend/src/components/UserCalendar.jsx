import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../context/UserContext.jsx";
import { useContext } from "react";

const styles = {
  flexGrow: "1",
  height: "50%",
  width: "50%",
  margin: "0 2%",
};

export default function UserCalendar() {
  const { user, setUser } = useContext(userContext);
  const userEvents = user.events.map((event) => {
    if (event.groupID !== null) {
      return {
        ...event,
        backColor: "#fb4d4d",
        text: `${event.text} - ${event.group.name}`,
      };
    }
    return {
      ...event,
      backColor: "#7f7fff",
      text: `${event.text} - ${user.username}`,
    };
  });
  
  const addEvent = (eventData) => {
    const EVENT_URL = `/api/user/${user.id}/events`;
    httpRequest(EVENT_URL, "POST", eventData).then((created) => {
      setUser({
        ...user,
        events: [...user.events, created.event],
      });
    });
  };

  const deleteEvent = (id) => {
    const EVENT_URL = `/api/user/${user.id}/events/${id}`;
    httpRequest(EVENT_URL, "DELETE").then(() => {
      setUser({
        ...user,
        events: user.events.filter((event) => event.id !== id),
      });
    });
  };

  const editEvent = (eventData) => {
    const EVENT_URL = `/api/user/${user.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  return (
    <div style={styles}>
      <Calendar
        events={userEvents}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../providers/UserProvider.jsx";
import { userGroupContext } from "../providers/UserGroupsProvider.jsx";
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
    return {
      ...event,
      backColor: "#4d9ffb",
      text: `${event.text} - ${user.username}`,
    };
  });

  const { groups } = useContext(userGroupContext);
  const groupEvents = groups.flatMap((group) => {
    return group.events.map((event) => {
      return {
        ...event,
        backColor: "#f35757",
        text: `${event.text} - ${group.name}`,
      };
    });
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
    httpRequest(EVENT_URL, "DELETE");
  };

  const editEvent = (eventData) => {
    const EVENT_URL = `/api/user/${user.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  return (
    <div style={styles}>
      <Calendar
        events={userEvents.concat(groupEvents)}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

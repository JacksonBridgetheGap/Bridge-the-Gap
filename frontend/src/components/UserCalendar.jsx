import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import { userContext } from "../context/UserContext.jsx";
import { useContext, useEffect, useState } from "react";

export default function UserCalendar() {
  const { user, setUser } = useContext(userContext);
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    const userEvents = user?.events.map((event) => {
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
      };
    });

    setUserEvents(userEvents);
  }, [user?.events, user.username]);

  const addEvent = (eventUTC, eventLocal) => {
    eventUTC.groupID = null;
    eventLocal.groupID = null;
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/events`;
    httpRequest(EVENT_URL, "POST", eventUTC).then(() => {
      setUser({
        ...user,
        events: [...user.events, eventLocal],
      });
    });
  };

  const deleteEvent = (event) => {
    if (event.groupID !== null) {
      const DISCONNECT_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/groups/${event.groupID}/events/${event.id}`;
      httpRequest(DISCONNECT_URL, "DELETE").then(() => {
        setUser({
          ...user,
          events: user.events.filter((event) => event.id !== id),
        });
      });
      return;
    }
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/events/${event.id}`;
    httpRequest(EVENT_URL, "DELETE").then(() => {
      setUser({
        ...user,
        events: user.events.filter((event) => event.id !== id),
      });
    });
  };

  const editEvent = (eventData) => {
    if (eventData.groupID !== null) {
      return;
    }
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/user/${user.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  return (
    <div className="flex-grow w-[60%] mx-[2%] m-4 p-6 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:shadow-lg">
      <Calendar
        events={user ? userEvents : []}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
    </div>
  );
}

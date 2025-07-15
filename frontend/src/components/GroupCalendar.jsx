import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import { useState, useMemo } from "react";

const styles = {
  flexGrow: "1",
  width: "90%",
  margin: "0 auto",
};

export default function GroupCalendar({ group, setGroup }) {
  const [optimalTime, setOptimalTime] = useState(null);

  const cachedEvents = useMemo(() => {
    if (group == null) {
      return [];
    }
    return [...group.events, ...(optimalTime ? [optimalTime] : [])];
  }, [group, optimalTime]);

  const addEvent = (eventData) => {
    eventData.members = group.members;
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

  const getOptimalTime = () => {
    const OPTIMAL_TIME_URL = `/api/group/${group.id}/optimalEvent`;
    httpRequest(OPTIMAL_TIME_URL, "GET").then((response) => {
      const suggestEvent = {
        start: response.bestTime.start,
        end: response.bestTime.end,
        text: "Suggested Event",
        backColor: "rgba(141,255,125,0.53)",
      };
      setOptimalTime(suggestEvent);
    });
  };

  return (
    <div style={styles}>
      <Calendar
        events={cachedEvents}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
      />
      <BridgeTheGapButton
        value={"Best Next Event Time"}
        onClick={getOptimalTime}
      />
    </div>
  );
}

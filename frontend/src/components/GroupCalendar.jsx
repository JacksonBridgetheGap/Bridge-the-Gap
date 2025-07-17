import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import { useState, useMemo } from "react";
import { DayPilot } from "@daypilot/daypilot-lite-react";

const styles = {
  flexGrow: "1",
  width: "90%",
  margin: "0 auto",
};

export default function GroupCalendar({ group, setGroup }) {
  const [optimalTime, setOptimalTime] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    httpRequest(OPTIMAL_TIME_URL, "GET")
      .then((response) => {
        const conflictLevel =
          response.numConflicts / Math.max(1, group.members.length);
        const suggestEvent = {
          start: response.bestTime.start,
          end: response.bestTime.end,
          text: `Suggested Event - ${response.numConflicts} Conflicts`,
          backColor:
            conflictLevel > 0.7
              ? "rgba(255,6,0,0.56)"
              : conflictLevel > 0.5
                ? "rgba(255,197,36,0.53)"
                : "rgba(141,255,125,0.53)",
          suggested: true,
        };
        setOptimalTime(suggestEvent);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSuggested = async (args) => {
    const modal = await DayPilot.Modal.prompt("Add suggested event", "Title");
    if (!modal.result) {
      return;
    }
    const newEvent = {
      start: args.e.start().toDate().toISOString(),
      end: args.e.end().toDate().toISOString(),
      id: DayPilot.guid(),
      text: modal.result,
      suggested: true,
    };
    await addEvent(newEvent);
    setOptimalTime(null);
  };

  return (
    <div style={styles}>
      <Calendar
        events={cachedEvents}
        onAdd={addEvent}
        onDelete={deleteEvent}
        onEdit={editEvent}
        handleSuggested={handleSuggested}
      />
      <BridgeTheGapButton
        value={"Best Next Event Time"}
        onClick={getOptimalTime}
        loading={loading}
      />
    </div>
  );
}

import Calendar from "./Calendar";
import { httpRequest } from "../utils/utils.js";
import BridgeTheGapButton from "./BridgeTheGapButton.jsx";
import { useState, useMemo } from "react";
import { DayPilot } from "@daypilot/daypilot-lite-react";
import { DateTime } from "luxon";
import moment from "moment-timezone";
import { popularTimezones } from "../data/timezones.js";

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function GroupCalendar({ group, setGroup }) {
  const [optimalTime, setOptimalTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const cachedEvents = useMemo(() => {
    if (group == null) {
      return [];
    }
    return [...group.events, ...(optimalTime ? [optimalTime] : [])];
  }, [group, optimalTime]);

  const addEvent = (eventUTC, eventLocal) => {
    eventUTC.members = group.members;
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/group/${group.id}/events`;
    httpRequest(EVENT_URL, "POST", eventUTC).then(() => {
      setGroup({
        ...group,
        events: [...group.events, eventLocal],
      });
    });
  };

  const deleteEvent = (id) => {
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/group/${group.id}/events/${id}`;
    httpRequest(EVENT_URL, "DELETE");
  };

  const editEvent = (eventData) => {
    const EVENT_URL = `${import.meta.env.VITE_BASE_URL}/api/group/${group.id}/events/${eventData.id}`;
    httpRequest(EVENT_URL, "PUT", eventData);
  };

  const getOptimalTime = () => {
    const OPTIMAL_TIME_URL = `${import.meta.env.VITE_BASE_URL}/api/group/${group.id}/optimalEvent`;
    setLoading(true);
    httpRequest(OPTIMAL_TIME_URL, "GET")
      .then((response) => {
        const conflictLevel =
          Math.floor(response).numConflicts / Math.max(1, group.members.length);
        const suggestEvent = {
          start: DateTime.fromISO(response.slot.start, {
            zone: "utc",
          })
            .setZone(userTimeZone)
            .toISO({ includeOffset: false }),
          end: DateTime.fromISO(response.slot.end, {
            zone: "utc",
          })
            .setZone(userTimeZone)
            .toISO({ includeOffset: false }),
          text: `Suggested Event - ${Math.floor(response.conflicts)} Conflicts`,
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

  const getApproximateTimezone = () => {
    const roundedOffset = Math.round(group.averageOffsetUTC / 60) * 60;
    const matchingZones = popularTimezones.filter((zone) => {
      const offset = moment.tz(new Date(), zone).utcOffset();
      return offset === -roundedOffset;
    });

    return matchingZones[0];
  };

  return (
    <div className="flex-grow w-[90%] mx-auto my-8 rounded-2xl border-b-3 border-b-blue-500 border border-gray-200 bg-white/70 backdrop-blur-md p-6 shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:shadow-lg">
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
      <p>
        {group
          ? group.averageOffsetUTC > 0
            ? `Your group timezone is (UTC-${Math.round(group.averageOffsetUTC / 60)}:00)`
            : `Your group timezone is (UTC+${Math.round(group.averageOffsetUTC / 60)}:00)`
          : "Loading group timezone..."}
      </p>
      <p>
        <em>Approximate Timezone: </em>{" "}
        {group ? getApproximateTimezone() : "Loading Approximate Timezone..."}
      </p>
      <p className="font-light text-gray-700">
        Group timezone information is based off the average timezone of the
        members in your group.
      </p>
    </div>
  );
}

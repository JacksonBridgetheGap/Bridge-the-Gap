import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useEffect, useState } from "react";
import "../styles/Calendar.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [calendar, setCalendar] = useState(null);

  const config = {
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Add a new event", "Title");
      calendar.clearSelection();
      if (!modal.result) {
        return;
      }
      calendar.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result,
      });
    },
    onEventClick: async (args) => {
      await EditEvent(args.e);
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Delete",
          onClick: async (args) => {
            calendar.events.remove(args.source);
          },
        },
        {
          text: "-",
        },
        {
          text: "Edit",
          onClick: async (args) => {
            await EditEvent(args.source);
          },
        },
      ],
    }),
    onBeforeEventRender: (args) => {
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
      ];
    },
  };

  const EditEvent = async (event) => {
    const modal = await DayPilot.Modal.prompt(
      "Update event name: ",
      event.text(),
    );
    if (!modal.result) {
      return;
    }
    event.data.text = modal.result;
    calendar.events.update(event);
  };

  useEffect(() => {
    const events = [
      {
        id: 1,
        text: "Event 1",
        start: "2025-07-14T12:00:00",
        end: "2025-07-14T15:00:00",
        participants: 2,
      },
      {
        id: 1,
        text: "Event 2",
        start: "2025-07-15T12:00:00",
        end: "2025-07-15T15:00:00",
        participants: 2,
      },
    ];
    setEvents(events);
  }, []);

  return (
    <div>
      <DayPilotCalendar {...config} events={events} controlRef={setCalendar} />
    </div>
  );
}

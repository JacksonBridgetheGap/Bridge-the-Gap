import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useState } from "react";
import "../styles/Calendar.css";

export default function Calendar({ events, onAdd, onDelete, onEdit }) {
  const [calendar, setCalendar] = useState(null);

  const config = {
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    heightSpec: "BusinessHours",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Add a new event", "Title");
      calendar.clearSelection();
      if (!modal.result) {
        return;
      }
      const newEvent = {
        start: args.start.toDate().toISOString(),
        end: args.end.toDate().toISOString(),
        id: DayPilot.guid(),
        text: modal.result,
      };
      onAdd(newEvent);
    },
    onEventClick: async (args) => {
      await editEvent(args.e);
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: "Delete",
          onClick: async (args) => {
            onDelete(args.source.cache.id);
            calendar.events.remove(args.source.cache.id);
          },
        },
        {
          text: "-",
        },
        {
          text: "Edit",
          onClick: async (args) => {
            await editEvent(args.source);
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

  const editEvent = async (event) => {
    const modal = await DayPilot.Modal.prompt(
      "Update event name: ",
      event.text(),
    );
    if (!modal.result) {
      return;
    }
    event.data.text = modal.result;
    calendar.events.update(event);
    onEdit({
      id: event.id(),
      start: event.start().toDate().toISOString(),
      end: event.end().toDate().toISOString(),
      text: modal.result,
    });
  };

  return (
    <div>
      <DayPilotCalendar {...config} events={events} controlRef={setCalendar} />
    </div>
  );
}

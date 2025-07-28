import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import { useState } from "react";
import "../styles/Calendar.css";

export default function Calendar({
  events,
  onAdd,
  onDelete,
  onEdit,
  handleSuggested,
}) {
  const [calendar, setCalendar] = useState(null);

  const config = {
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    heightSpec: "BusinessHours",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Add a new event", "", {
        okText: "Confirm",
        scrollWithPage: true,
      });
      calendar.clearSelection();
      if (!modal.result) {
        return;
      }
      const newEventUTC = {
        start: new Date(
          args.start.toDate().getTime() +
            args.start.toDate().getTimezoneOffset() * 60000,
        ).toISOString(),
        end: new Date(
          args.end.toDate().getTime() +
            args.end.toDate().getTimezoneOffset() * 60000,
        ).toISOString(),
        id: DayPilot.guid(),
        text: modal.result,
      };

      const newEventLocal = {
        start: args.start.toDate(),
        end: args.end.toDate(),
        id: DayPilot.guid(),
        text: modal.result,
      };

      onAdd(newEventUTC, newEventLocal);
    },
    onEventClick: async (args) => {
      if (args.e.data.suggested) {
        await handleSuggested(args);
        return;
      }
      await editEvent(args.e);
    },
    contextMenu: new DayPilot.Menu({
      items: [
        {
          text: `Delete`,
          onClick: async (args) => {
            if (args.source.cache.suggested) return;
            onDelete(args.source.cache);
            calendar.events.remove(args.source.cache.id);
          },
        },
        {
          text: "-",
        },
        {
          text: "Edit",
          onClick: async (args) => {
            if (args.source.cache.suggested) return;
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
      start: new Date(
        event.start().toDate().getTime() +
          event.start().toDate().getTimezoneOffset() * 60000,
      ).toISOString(),
      end: new Date(
        event.end().toDate().getTime() +
          event.end().toDate().getTimezoneOffset() * 60000,
      ).toISOString(),
      text: modal.result,
    });
  };

  return (
    <div>
      <p className="text-2xl font-bold dark:text-white">
        Your Timezone:{" "}
        <em>{Intl.DateTimeFormat().resolvedOptions().timeZone}</em>
      </p>
      <DayPilotCalendar
        {...config}
        events={events}
        controlRef={setCalendar}
        timeZone={Intl.DateTimeFormat().resolvedOptions().timeZone}
      />
    </div>
  );
}

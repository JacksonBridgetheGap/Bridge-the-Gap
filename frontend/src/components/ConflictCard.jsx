import "../styles/ToolTip.css";

export default function ConflictCard({ conflict }) {
  return (
    <div className={"flex flex-row justify-between"}>
      <h4>{conflict.text}</h4>
      <p>{`${new Date(conflict.start).toLocaleTimeString()} - ${new Date(conflict.end).toLocaleTimeString()}`}</p>
      <div className={"tooltip"}>
        <div className={"bg-gray-600 border border-gray-700 w-6 h-6"}>...</div>
        <div className="tooltiptext">
          {conflict.participants.map((participant) => {
            return <p>{participant.username}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

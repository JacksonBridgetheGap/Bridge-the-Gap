import Calendar from "./Calendar";

export default function GroupCalendar() {
  const styles = {
    flexGrow: "1",
    width: "90%",
    margin: "0 auto",
  };

  return (
    <div style={styles}>
      <Calendar />
    </div>
  );
}

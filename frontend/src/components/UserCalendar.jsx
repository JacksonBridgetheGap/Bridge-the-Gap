import Calendar from "./Calendar";

export default function UserCalendar() {
  const styles = {
    flexGrow: "1",
    height: "50%",
    width: "50%",
    margin: "0 2%",
  };

  return (
    <div style={styles}>
      <Calendar styles={styles} />
    </div>
  );
}

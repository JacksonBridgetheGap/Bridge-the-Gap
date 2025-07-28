import { useState, useEffect, useMemo } from "react";
import "../styles/ToolTip.css";

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;
const SECOND_MS = 1000;

export default function GroupTimer({ lastRefresh }) {
  const nextRefresh = useMemo(() => {
    return new Date(lastRefresh.getTime() + DAY_MS * 7);
  }, [lastRefresh]);

  const [timeToRefresh, setTimeToRefresh] = useState(
    nextRefresh - new Date().getTime(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeToRefresh(timeToRefresh - SECOND_MS);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeToRefresh]);

  const convertMsToTime = (ms, timeInMs, mod) => {
    return (Math.floor(ms / timeInMs) % mod).toString().padStart(2, "0");
  };

  return (
    <div className="tooltip">
      <span className="tooltiptext">Time to next challenge refresh</span>
      <span
        className={"font-bold text-3xl"}
      >{`${convertMsToTime(timeToRefresh, DAY_MS, 7)} : ${convertMsToTime(timeToRefresh, HOUR_MS, 24)} : ${convertMsToTime(timeToRefresh, MINUTE_MS, 60)} : ${convertMsToTime(timeToRefresh, SECOND_MS, 60)}`}</span>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

/*
 * The hero's session clock: UTC, ticking once a second (a clock is data,
 * so it may move). Server-renders a placeholder so hydration stays clean;
 * under reduced motion it sets the time once and holds - a paused session.
 */
export default function SessionClock() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const set = () =>
      setTime(new Date().toISOString().slice(11, 19));
    set();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(set, 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time} UTC</span>;
}

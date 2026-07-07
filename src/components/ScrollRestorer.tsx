"use client";

import { useEffect } from "react";

/*
 * Back/forward scroll restoration. Next 16's App Router re-renders a
 * traversed page asynchronously, which defeats the browser's native
 * restore (the document is still short when the browser tries), so Back
 * lands at the top instead of where you left. This records scrollY per
 * history entry (sessionStorage, keyed by an index stamped into
 * history.state) and re-applies it after popstate once the document is
 * tall enough. Normal link navigations still start at the top - Next
 * scrolls those itself; this only acts on traversals and reloads.
 */

const STORE_KEY = "snehanshn-scroll";
const IDX_KEY = "__scrollIdx";
const RESTORE_DEADLINE = 800; // ms to wait for the traversed page's height

type Positions = Record<string, number>;

function readPositions(): Positions {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export default function ScrollRestorer() {
  useEffect(() => {
    const positions = readPositions();
    let nextIdx =
      Math.max(
        0,
        ...Object.keys(positions).map(Number).filter(Number.isFinite)
      ) + 1;

    // Stamp the entry we loaded into; entries created before this mount
    // (e.g. after a reload) already carry theirs in persisted state.
    if (typeof history.state?.[IDX_KEY] !== "number") {
      history.replaceState({ ...history.state, [IDX_KEY]: nextIdx++ }, "");
    }
    let currentIdx: number = history.state[IDX_KEY];

    let restoreRaf = 0;
    let restoring = false;

    const save = () => {
      if (restoring) return; // transient positions mid-restore are not the user's
      positions[currentIdx] = window.scrollY;
      try {
        sessionStorage.setItem(STORE_KEY, JSON.stringify(positions));
      } catch {
        // best-effort persistence only
      }
    };

    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        save();
      });
    };

    const restore = (y: number) => {
      cancelAnimationFrame(restoreRaf);
      restoring = true;
      const deadline = performance.now() + RESTORE_DEADLINE;
      const attempt = () => {
        const fits =
          document.documentElement.scrollHeight - window.innerHeight >= y;
        if (fits || performance.now() > deadline) {
          window.scrollTo(0, y);
          restoring = false;
          return;
        }
        restoreRaf = requestAnimationFrame(attempt);
      };
      restoreRaf = requestAnimationFrame(attempt);
    };

    // Next's router drives history itself, so entries are indexed by
    // wrapping pushState: the leaving entry's position is saved and the
    // new entry gets a fresh index. replaceState keeps the current one.
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (state, unused, url) => {
      save();
      cancelAnimationFrame(restoreRaf);
      restoring = false;
      currentIdx = nextIdx++;
      origPush({ ...state, [IDX_KEY]: currentIdx }, unused, url);
    };
    history.replaceState = (state, unused, url) => {
      origReplace({ ...state, [IDX_KEY]: currentIdx }, unused, url);
    };

    const onPop = (e: PopStateEvent) => {
      const idx = e.state?.[IDX_KEY];
      if (typeof idx !== "number") return;
      currentIdx = idx;
      const y = positions[idx];
      if (typeof y === "number" && y > 0) restore(y);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);

    // Reloads lose their position to the same async render; re-apply it.
    const prevRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    const y = positions[currentIdx];
    if (nav?.type === "reload" && typeof y === "number" && y > 0) restore(y);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      history.pushState = origPush;
      history.replaceState = origReplace;
      history.scrollRestoration = prevRestoration;
      cancelAnimationFrame(restoreRaf);
    };
  }, []);

  return null;
}

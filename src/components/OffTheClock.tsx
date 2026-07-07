import { offTheClock } from "@/content";
import Section from "./Section";

export default function OffTheClock() {
  return (
    <Section id="off-the-clock" index="03" title="Off the Clock">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {offTheClock.photoSlots.map((slot) => (
          <li
            key={slot.alt}
            className="flex aspect-square items-center justify-center rounded-md border border-dashed border-trace bg-surface/60"
          >
            {/* TODO(snehanshn): real photos replace these slots (see content.ts) */}
            <span className="font-mono text-[11px] text-noise/60">
              {slot.alt}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-xs leading-relaxed text-noise">
        <span aria-hidden="true" className="text-signal">
          ▸{" "}
        </span>
        {offTheClock.currently}
      </p>
    </Section>
  );
}

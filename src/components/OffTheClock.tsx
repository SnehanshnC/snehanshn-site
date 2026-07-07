import { offTheClock } from "@/content";
import Section from "./Section";

export default function OffTheClock() {
  // Photo slots stay hidden until content.ts carries real images (see TODO there);
  // shipping dashed placeholder boxes reads as unfinished, not restrained.
  const photos = offTheClock.photoSlots.filter((slot) => slot.src);

  return (
    <Section id="off-the-clock" index="03" title="Off the Clock">
      {photos.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {photos.map((slot) => (
            <li
              key={slot.alt}
              className="aspect-square overflow-hidden rounded-md border border-trace bg-surface/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slot.src}
                alt={slot.alt}
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}
      <p
        className={`font-mono text-xs leading-relaxed text-noise ${photos.length > 0 ? "mt-8" : ""}`}
      >
        <span aria-hidden="true" className="text-signal">
          ▸{" "}
        </span>
        {offTheClock.currently}
      </p>
    </Section>
  );
}

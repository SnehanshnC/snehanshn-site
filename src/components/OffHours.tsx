import { offTheClock } from "@/content";
import ModuleHeader from "./ModuleHeader";

/*
 * 03 / OFF-HOURS - a small module; the desk after close.
 * Photo slots stay hidden until content.ts carries real images (see TODO
 * there); dashed placeholder boxes read as unfinished, not restrained.
 */
export default function OffHours() {
  const photos = offTheClock.photoSlots.filter((slot) => slot.src);

  return (
    <section id="off-hours">
      <ModuleHeader index="03" title="Off-Hours" readout="MARKET CLOSED" />
      <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">
        {photos.length > 0 && (
          <ul className="mb-7 grid grid-cols-2 gap-px border border-trace/50 bg-trace/50 sm:grid-cols-4">
            {photos.map((slot) => (
              <li key={slot.alt} className="aspect-square overflow-hidden bg-surface">
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
        <p className="font-mono text-xs leading-relaxed text-noise">
          <span aria-hidden="true" className="text-signal">
            ▸{" "}
          </span>
          {offTheClock.currently}
        </p>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import { contact, experience, identity } from "@/content";

export const metadata: Metadata = {
  title: "About - Snehanshn Chowdhury",
  description:
    "Who Snehanshn Chowdhury is: bio, education, what he's building now, and how to reach him.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About - Snehanshn Chowdhury",
    description:
      "Who Snehanshn Chowdhury is: bio, education, what he's building now, and how to reach him.",
    url: "/about",
    siteName: "Snehanshn Chowdhury",
    type: "website",
    // The root segment's opengraph-image.png does not cascade past a page
    // that declares its own openGraph object, so point at it explicitly.
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
};

/* Links still awaiting a real URL (`#todo` in content.ts) are not rendered. */
const links = [contact.github, contact.linkedin, contact.x, contact.email].filter(
  (link) => link.href !== "#todo"
);

export default function About() {
  const s = identity.aboutStatement;
  const now = experience[0];
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8">
      <section className="py-16 sm:py-20 lg:py-24">
        <h1 className="statement rise-move max-w-3xl text-[clamp(2rem,4.8vw,3.4rem)] leading-[1.14] text-balance">
          {s.pre}
          <em className="text-signal">{s.emphasis}</em>
          {s.post}
        </h1>
      </section>

      <section className="grid grid-cols-1 gap-x-14 gap-y-12 pb-20 sm:pb-24 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-4 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase">
            The short version
          </h2>
          <p className="max-w-prose text-[16px] leading-relaxed">
            {identity.bio}
          </p>
          <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-faint">
            Right now that means {now.company}:{" "}
            {now.summary.charAt(0).toLowerCase() + now.summary.slice(1)}
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:col-span-5">
          <div>
            <h2 className="mb-4 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase">
              Education
            </h2>
            <p className="text-[15px]">{identity.education}</p>
          </div>

          <div>
            <h2 className="mb-4 font-mono text-[12px] font-medium tracking-[0.14em] text-faint uppercase">
              Reach me
            </h2>
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label} className="border-b border-line first:border-t">
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={`${l.label.toLowerCase()} ↗`}
                    className="flex min-h-11 items-center justify-between py-2 text-[15px] transition-colors duration-150 hover:text-signal"
                  >
                    {l.label}
                    <span aria-hidden="true" className="font-mono text-[13px] text-faint">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {/* TODO(snehanshn): LinkedIn / X / email light up here once
                their hrefs in content.ts stop being #todo. */}
          </div>
        </div>
      </section>
    </main>
  );
}

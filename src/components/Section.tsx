export default function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-6 py-20 md:px-10 md:py-28">
      <h2 className="flex items-baseline gap-3 font-mono text-xs tracking-[0.18em] text-noise uppercase">
        <span aria-hidden="true" className="text-signal">
          {index}
        </span>
        {title}
      </h2>
      <div className="mt-10">{children}</div>
    </section>
  );
}

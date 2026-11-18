const stats = [
  { value: "500+",   label: "Expert Tutors",   sub: "Verified & background-checked" },
  { value: "1,200+", label: "Subjects",         sub: "From Math to Music & beyond"   },
  { value: "800+",   label: "Active Students",  sub: "Learning with confidence daily" },
  { value: "50+",    label: "Categories",       sub: "Covering all academic levels"   },
];

export default function StatsSection() {
  return (
    <section className="py-14 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary mb-1">{value}</p>
              <p className="text-sm font-semibold text-foreground mb-0.5">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

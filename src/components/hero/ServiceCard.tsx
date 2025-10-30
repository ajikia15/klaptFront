export default function ServiceCard() {
  return (
    <div className="min-w-64 relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-neutral-700">
      <img
        src="/static/maintenance.jpg"
        className="h-full w-full object-cover object-center"
        alt=""
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <div className="absolute inset-0 flex items-end p-3">
        <span className="logo-text text-lg text-white drop-shadow">
          Test any System
        </span>
      </div>
    </div>
  );
}

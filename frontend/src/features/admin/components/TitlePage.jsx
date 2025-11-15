export default function TitlePage({ title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        <span className="h-9 w-1.5 rounded-full bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
        <h1 className="text-3xl font-semibold text-slate-800">{title}</h1>
      </div>
      {description && (
        <p className="text-slate-600 mt-2 text-sm">{description}</p>
      )}
    </div>
  );
}

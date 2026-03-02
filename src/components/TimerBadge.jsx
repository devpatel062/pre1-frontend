export default function TimerBadge({ seconds }) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  return (
    <div className="rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
      Time left: {hrs}:{mins}:{secs}
    </div>
  );
}

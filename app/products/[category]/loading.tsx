import Spinner from "@/components/shared/Spinner";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 animate-pulse">Loading…</p>
    </div>
  );
}

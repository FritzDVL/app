export function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
      {text && <p className="mt-4 text-slate-600">{text}</p>}
    </div>
  );
}

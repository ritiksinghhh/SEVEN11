export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="h-6 w-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
    </div>
  );
}

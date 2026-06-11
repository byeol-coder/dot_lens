export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="fixed bottom-5 left-4 right-4 z-50 rounded-2xl bg-white px-4 py-3 text-center font-bold text-navy shadow-glow sm:left-auto sm:w-96">{message}</div>;
}

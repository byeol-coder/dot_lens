export function ConfirmModal({
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  tone = 'danger',
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-4 sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-deepnavy p-5 shadow-glow">
        <h2 id="confirm-title" className="text-xl font-black text-white">{title}</h2>
        <p className="mt-2 text-white/70">{message}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className="rounded-2xl bg-white/10 px-4 py-4 font-black text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">
            {cancelLabel}
          </button>
          <button type="button" onClick={onConfirm} className={`rounded-2xl px-4 py-4 font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky ${tone === 'danger' ? 'bg-rose-500 text-white' : 'bg-spiritSky text-navy'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

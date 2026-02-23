interface ErrorStateProps {
  message: string;
  onDismiss: () => void;
}

const ErrorState = ({ message, onDismiss }: ErrorStateProps) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-100">
    <div>
      <p className="font-semibold">Bir şeyler ters gitti</p>
      <p className="mt-1 text-rose-600 dark:text-rose-200">{message}</p>
    </div>
    <button
      className="rounded-lg border border-rose-400/40 px-2 py-1 text-xs"
      onClick={onDismiss}
    >
      Kapat
    </button>
  </div>
);

export default ErrorState;

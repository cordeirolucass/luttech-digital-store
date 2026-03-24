import { useToasts } from '../context/ToastContext';

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

export default function ToastContainer() {
  const toasts = useToasts();

  return (
    <div className="toast-container" aria-live="polite" aria-label="Notificações">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type} ${toast.exiting ? 'toast--exiting' : ''}`}
          role="alert"
        >
          <span className="toast__icon" aria-hidden="true">{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

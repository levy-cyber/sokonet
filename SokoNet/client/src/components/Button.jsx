export default function Button({ children, className = '', ...props }) {
  return (
    <button
      type={props.type || 'button'}
      className={`inline-flex items-center justify-center rounded-full bg-brand-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-soft transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

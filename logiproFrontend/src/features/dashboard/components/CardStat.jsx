

export default function CardStat({ label, value, hint, className = '' }) {
    return (
        <div className={`card shadow-sm h-100 ${className}`}>
      <div className="card-body">
        <span className="small">{label}</span>
        <div className="display-6 fw-semibold mt-1">{value}</div>
        {hint && <small className="opacity-75">{hint}</small>}
      </div>
    </div>
    );
}   

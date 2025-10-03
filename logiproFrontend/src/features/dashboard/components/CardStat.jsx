/**
 * CardStat
 * Tarjeta KPI reutilizable para Bootstrap 5.
 *
 * Props:
 * - label: string (ej. "Productos")
 * - value: number|string (ej. 0)
 * - hint: string opcional (ej. "Total de SKUs")
 * - className: string opcional para estilos extra
 */

export default function CardStat({ label, value, hint, className = '' }) {
    return (
        <div className={`card shadow-sm h-100 ${className}`}>
      <div className="card-body">
        <span className="text-muted">{label}</span>
        <div className="display-6 fw-semibold mt-1">{value}</div>
        {hint && <small className="text-muted">{hint}</small>}
      </div>
    </div>
    );
}   

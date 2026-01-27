import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors",
  {
    variants: {
      status: {
        submitted: "bg-status-submitted/15 text-amber-700",
        auto_suggested: "bg-status-suggested/15 text-blue-700",
        approved: "bg-status-approved/15 text-emerald-700",
        rejected: "bg-status-rejected/15 text-red-700",
        active: "bg-status-approved/15 text-emerald-700",
        inactive: "bg-muted text-muted-foreground",
        available: "bg-status-approved/15 text-emerald-700",
        unavailable: "bg-status-rejected/15 text-red-700",
      },
    },
    defaultVariants: {
      status: "submitted",
    },
  }
);

function StatusBadge({ status, label }) {
  const displayLabel =
    label ||
    (status && status.replace("_", " ")) ||
    "Unknown";

  return (
    <span className={badgeVariants({ status })} style={{fontSize : '10px'}}>
      {displayLabel.toUpperCase()}
    </span>
  );
}
export default StatusBadge;
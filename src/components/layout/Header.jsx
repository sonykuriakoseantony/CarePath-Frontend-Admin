import { BiBell, BiSearch } from "react-icons/bi";
import { useData } from "../../context/DataContext";

function Header({ title, subtitle }) {
  const { symptoms } = useData();
  const pendingCount = symptoms.filter(
    (s) => s.status == "SUBMITTED"
  ).length;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div>
        <p className="font-display text-xl font-bold text-foreground">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <BiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search..."  className="h-9 w-64 rounded-lg border border-input bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"/>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <BiBell className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {pendingCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header;

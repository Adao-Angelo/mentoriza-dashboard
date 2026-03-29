import { getInitials } from "initials-extractor";

interface UserProfileDisplayProps {
  username?: string | null;
  email?: string | null;
  className?: string;
  onClick?: () => void;
  status?: string;
}

export default function UserProfileDisplay({
  username,
  email,
  className = "",
  onClick,
  status,
}: UserProfileDisplayProps) {
  let initials: string;

  if (!username || typeof username !== "string" || username.trim() === "") {
    initials = "??";
  } else {
    try {
      initials = getInitials(username.trim());
    } catch (err) {
      console.warn("getInitials falhou:", err);
      initials =
        username
          .trim()
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "??";
    }
  }

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer min-w-0 flex-1 ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white">
        <span className="text-base font-semibold text-Gray">{initials}</span>
        {status == "active" && (
          <div className="text-sm p-1 pt-px bg-green-100 text-green-600 rounded-full border border-green-200 absolute -bottom-2 -right-0.75">
            <p className="font-bold">Ative</p>
          </div>
        )}
      </div>

      <div className="min-w-0 truncate hidden md:flex md:flex-col md:items-start">
        {username && (
          <p className="text-base font-semibold leading-tight text-gray-600 truncate">
            {username}
          </p>
        )}
        {email && <p className="text-xs text-gray-500 truncate w-10">{email}</p>}
      </div>
    </div>
  );
}

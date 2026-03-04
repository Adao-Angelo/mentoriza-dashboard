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
  const initials = getInitials(username ?? "A");

  return (
    <div
      className={`flex items-center gap-2 cursor-pointer ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-white">
        <span className="text-base font-semibold text-Gray">{initials}</span>
        {status == "active" && (
          <div className="text-[8px] p-1 pt-[1px]   bg-green-100 text-green-600 rounded-full border border-green-200 absolute bottom-[-8px] right-[-3px]">
            <p className="font-bold">Ative</p>
          </div>
        )}
      </div>

      <div className="hidden md:flex md:flex-col md:items-start">
        {username && (
          <p className="text-[14px] font-semibold leading-tight text-gray-600">
            {username}
          </p>
        )}
        {email && <p className="text-xs text-gray-500">{email}</p>}
      </div>
    </div>
  );
}

"use client";

interface ExtraItem {
  label: string;
  value: string | number;
  color?: string;
}

interface StatsCardProps {
  title: string;
  value: string | number;
  extras?: ExtraItem[];
}

export default function StatsCard({ title, value, extras }: StatsCardProps) {
  return (
    <div className="flex justify-between w-full items-start">
      <div>
        <p className="text-[14px] text-Gray">{title}</p>
        <h1 className="font-bold mt-2 text-lg">{value}</h1>
      </div>

      {extras?.map((item, index) => (
        <div key={index}>
          <p className={`text-[14px] ${item.color ?? "text-Gray"}`}>
            {item.label}
          </p>
          <h1 className="font-bold mt-2 text-lg">{item.value}</h1>
        </div>
      ))}
    </div>
  );
}

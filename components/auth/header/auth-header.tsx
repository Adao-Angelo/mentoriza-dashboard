import { Logo } from "@/components/logo";

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-start p-8 gap-4">
      <Logo isPrimary />
    </div>
  );
}

import GlobalLoader from "@/components/loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <GlobalLoader />
    </div>
  );
}

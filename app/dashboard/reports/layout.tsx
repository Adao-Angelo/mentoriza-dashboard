import { ReportsProvider } from "@/context/reports-context";

export default function ReportLayout({ children }: any) {
  return (
    <html lang="pt">
      <body>
        <ReportsProvider>
          {children}
        </ReportsProvider>
      </body>
    </html>
  );
}
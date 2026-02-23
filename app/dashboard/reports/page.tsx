'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  FileDown,
  FileSearch,
  MoreHorizontal,
  CloudUpload,
  ArrowUpFromLine,
  FileText,
  Eye,
  Trash2,
} from "lucide-react";

interface Report {
  id: string;
  groupNumber: number;
  theme: string;
  date: string;
  status: string;
  fileName: string;
}

interface TopButtonsProps {
  isDetailPage?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  openDialog?: () => void;
}

function TopButtons({ isDetailPage, onApprove, onReject, openDialog }: TopButtonsProps) {
  if (isDetailPage) {
    return (
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" className="w-28 h-11" onClick={onApprove}>
          Aprovar
        </Button>
        <Button variant="destructive" className="w-28 h-11" onClick={onReject}>
          Reprovar
        </Button>
        <Button variant="outline" className="w-28 h-11">
          Exportar
          <FileDown />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <DialogTrigger asChild>
        <Button className="w-38.25 h-11" onClick={openDialog}>
          Enviar Relatório
          <Plus />
        </Button>
      </DialogTrigger>
      <Button variant="outline" className="w-28 h-11">
        Exportar
        <FileDown />
      </Button>
    </div>
  );
}

function EmptyReportsView() {
  return (
    <div className="flex flex-col justify-center items-center mt-[8rem]">
      <FileSearch strokeWidth={1} className="w-12 h-12" />
      <div className="mt-5 text-center">
        <p className="text-sm font-medium">Nenhum registro encontrado</p>
        <p className="text-sm font-normal text-[#999999]">
          Não há registros de reportes disponíveis no momento.
        </p>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!selectedFile) return;

    const newReport: Report = {
      id: crypto.randomUUID(),
      groupNumber: Math.floor(Math.random() * 10) + 1,
      theme: selectedFile.name.replace(".pdf", ""),
      date: new Date().toLocaleDateString(),
      status: "Pendente",
      fileName: selectedFile.name,
    };

    setReports((prev) => [...prev, newReport]);
    setSelectedFile(null);
    setOpen(false);
  };

  const handleDelete = (id: string) => {
    setReports((prev) => prev.filter((report) => report.id !== id));
  };

  const updateStatus = (id: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((report) => (report.id === id ? { ...report, status: newStatus } : report))
    );
  };

  return (
    <div className="w-full flex flex-col px-3 mt-2">

      <Dialog open={open} onOpenChange={setOpen}>
        <TopButtons isDetailPage={false} openDialog={() => setOpen(true)} />

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Relatório</DialogTitle>
          </DialogHeader>

          <div
            className="border-2 border-dashed border-primary rounded-xl p-10 text-center flex flex-col items-center cursor-pointer hover:bg-gray-50 transition"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) setSelectedFile(file);
            }}
            onClick={() => document.getElementById("fileUpload")?.click()}
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F3E8FF] mb-3">
              <CloudUpload color="#9810FA" />
            </div>

            {selectedFile ? (
              <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-primary">Arraste e solte o ficheiro aqui</p>
                <p className="text-xs text-gray-400 mt-2">ou clique para selecionar</p>
              </>
            )}

            <input
              type="file"
              className="hidden"
              id="fileUpload"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setSelectedFile(file);
              }}
            />
          </div>

          <DialogFooter>
            <Button
              className="bg-black h-10.5 gap-2"
              disabled={!selectedFile}
              onClick={handleSubmit}
            >
              Enviar Relatório
              <ArrowUpFromLine />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {reports.length === 0 ? (
        <EmptyReportsView />
      ) : (
        <div className="mt-6 border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Grupo</th>
                <th className="p-3">Tema</th>
                <th className="p-3">Data de Envio</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="p-3">#{report.groupNumber}</td>
                  <td className="p-3">{report.theme}</td>
                  <td className="p-3">{report.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : report.status === "Aprovado"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-36 p-1">
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm">
                          <Link href={`/dashboard/reports/${report.id}`} className="flex w-full items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Detalhes
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm">
                          <FileText className="h-4 w-4" />
                          Referência
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer text-sm"
                          onClick={() => handleDelete(report.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
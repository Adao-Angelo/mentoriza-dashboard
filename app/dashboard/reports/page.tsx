"use client";

import { useState, useEffect } from "react";
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

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

useEffect(() => {
  const loadReports = () => {
    const stored = localStorage.getItem("reports");
    if (stored) {
      setReports(JSON.parse(stored));
    }
  };

  loadReports();

  window.addEventListener("focus", loadReports);

  return () => {
    window.removeEventListener("focus", loadReports);
  };
}, []);

  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

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

  return (
    <div className="w-full flex flex-col px-3 mt-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end gap-2 mb-4">
          <DialogTrigger asChild>
            <Button className="w-38.25 h-11">
              Enviar Relatório
              <Plus />
            </Button>
          </DialogTrigger>

          <Button variant="outline" className="w-28 h-11">
            Exportar
            <FileDown />
          </Button>
        </div>

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
            <CloudUpload className="w-10 h-10 mb-3 text-primary" />

            {selectedFile ? (
              <p className="text-sm font-medium text-primary">
                {selectedFile.name}
              </p>
            ) : (
              <>
                <p className="text-sm text-primary">
                  Arraste e solte o ficheiro aqui
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  ou clique para selecionar
                </p>
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
        <div className="flex flex-col items-center mt-20">
          <FileSearch className="w-12 h-12" />
          <p className="mt-4 text-sm text-muted-foreground">
            Nenhum registro encontrado
          </p>
        </div>
      ) : (
        <div className="mt-6 border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Grupo</th>
                <th className="p-3">Tema</th>
                <th className="p-3">Data</th>
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
                        <Button size="icon" variant="secondary">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/reports/${report.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detalhes
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDelete(report.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
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
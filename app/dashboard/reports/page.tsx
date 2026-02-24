"use client";

import { useState } from "react";
import { useReports } from "@/hooks/reports/use-reports";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, FileDown, MoreHorizontal, CloudUpload, ArrowUpFromLine, Eye, Trash2, FileSearch } from "lucide-react";

export default function ReportsPage() {
  const { reports, loading, uploading, createReport, removeLocalReport } = useReports();

  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    try {
      await createReport(selectedFile, 1);
      setSelectedFile(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatStatus = (status: string) =>
    status === "under_review" ? "Pendente" : status === "approved" ? "Aprovado" : "Reprovado";

  const statusStyle = (status: string) =>
    status === "under_review" ? "bg-yellow-100 text-yellow-700" :
    status === "approved" ? "bg-green-100 text-green-700" :
    status === "rejected" ? "bg-red-100 text-red-700" : "";

  return (
    <div className="w-full flex flex-col px-3 mt-2">

      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex justify-end gap-2 mb-4">
          <DialogTrigger asChild>
            <Button className="w-40 h-11 px-2">
              Adicionar Relatório
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
              <p className="text-sm font-medium text-primary">{selectedFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-primary">Arraste e solte o ficheiro aqui</p>
                <p className="text-xs text-gray-400 mt-2">ou clique para selecionar</p>
              </>
            )}
            <input type="file" className="hidden" id="fileUpload" accept=".pdf" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }} />
          </div>

          <DialogFooter>
            <Button className="bg-black h-10 gap-2" disabled={!selectedFile || uploading} onClick={handleSubmit}>
              {uploading ? "Enviando..." : "Enviar Relatório"}
              <ArrowUpFromLine />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center mt-20 text-sm text-muted-foreground">Carregando relatórios...</div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center mt-20">
          <FileSearch className="w-12 h-12" />
          <p className="mt-4 text-sm text-muted-foreground">Nenhum registro encontrado</p>
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
                  <td className="p-3">#{report.groupId}</td>
                  <td className="p-3 font-medium">{report.title}</td>
                  <td className="p-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${statusStyle(report.status)}`}>
                      {formatStatus(report.status)}
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
                            <Eye className="h-4 w-4 mr-2" /> Detalhes
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => removeLocalReport(report.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> Deletar
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
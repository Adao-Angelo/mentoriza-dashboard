"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CloudUpload, File, X } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

type FileWithPreview = File & { preview?: string };

interface DropzoneProps {
  files: FileWithPreview[];
  setFiles: React.Dispatch<React.SetStateAction<FileWithPreview[]>>;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number;
  title?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropzone({
  files,
  setFiles,
  accept = { "text/csv": [".csv"] },
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024,
  title = "Arraste ou clique para selecionar o ficheiro CSV",
  description = "Apenas arquivos .csv são permitidos",
  className,
  disabled = false,
}: DropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (maxFiles === 1) {
        setFiles(acceptedFiles);
      } else {
        setFiles((prev) => [...prev, ...acceptedFiles].slice(0, maxFiles));
      }
    },
    [setFiles, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept,
      maxFiles,
      maxSize,
      disabled,
    });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasError = fileRejections.length > 0;

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={twMerge(
          "border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 bg-muted/30",
          disabled && "opacity-60 cursor-not-allowed pointer-events-none",
          hasError && "border-destructive bg-destructive/5",
          "min-h-[200px] flex flex-col items-center justify-center gap-4",
        )}
      >
        <input {...getInputProps()} />

        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <CloudUpload className="h-7 w-7 text-primary" />
        </div>

        <div className="space-y-1">
          <p className="text-base font-medium text-primary">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="mt-3 text-xs text-destructive flex items-center gap-1.5 justify-center">
          <AlertCircle className="h-3.5 w-3.5" />
          {fileRejections[0].errors[0]?.message || "Arquivo inválido"}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-5 space-y-3">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-muted/50 px-4 py-3 rounded-lg text-sm border"
            >
              <div className="flex items-center gap-3 truncate flex-1">
                <div className="flex w-10 h-10 rounded-[12px] bg-purple-100 items-center justify-center">
                  <File className="h-5 w-5 text-primary shrink-0" />
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="text-muted-foreground hover:text-destructive transition-colors ml-3 shrink-0"
                aria-label="Remover arquivo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React, { useState } from "react"
import { Upload, FileText, X, CheckCircle2, AlertCircle, ArrowUpDown } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

import { DataTable } from "./DataTable"

const fileTypes = [
  { alt: "PDF", iconUrl: "/icons/pdf-icon.svg" },
  { alt: "Docs", iconUrl: "/icons/doc-icon.svg" },
  { alt: "Txt", iconUrl: "/icons/txt-icon.svg" },
]

export function DocumentManager() {
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: false,
  })

  // Dokumentumok adatai
  const [documents, setDocuments] = useState([
    { id: "728ed52f", name: "2026_contract.pdf", type: "PDF", status: "Success", size: "2.4 MB" },
    { id: "489e1d42", name: "2025_reports.docx", type: "DOCX", status: "Success", size: "1.1 MB" },
    { id: "392f1b11", name: "project_brief.docx", type: "DOCX", status: "Processing", size: "837 KB" },

    { id: "512a9381", name: "2021_metadata.txt", type: "TXT", status: "Failed", size: "15 KB" },
  ])

  // Táblázat oszlopainak definíciója
  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Document
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 font-medium">
          <FileText className="size-4 text-muted-foreground shrink-0" />
          <span>{row.getValue("name")}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="text-xs font-mono uppercase text-muted-foreground">
          {row.getValue("type")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return (
          <div className="font-medium text-xs">
            {status === "Success" && <span className="text-emerald-500">Success</span>}
            {status === "Processing" && <span className="text-amber-500">Processing</span>}
            {status === "Failed" && <span className="text-rose-500">Failed</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "size",
      header: () => <div className="text-right">Size</div>,
      cell: ({ row }) => (
        <div className="text-right font-mono text-xs">{row.getValue("size")}</div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right sr-only">Actions</div>,
      cell: ({ row }) => {
        const doc = row.original
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              onClick={() => setDocuments(documents.filter((d) => d.id !== doc.id))}
              title="Delete document"
            >
              <X className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="w-full space-y-6">
      {/* 1. Dropzone feltöltő felület */}
      <div
        {...getRootProps({
          className:
            "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-8 text-center cursor-pointer hover:bg-muted/40 transition-colors gap-4",
        })}
      >
        <input {...getInputProps()} />

        <p className="text-xl font-medium text-foreground">
          Drag &amp; Drop Files to Upload
        </p>

        <div className="flex items-center gap-5 my-1">
          {fileTypes.map((f, i) => (
            <img
              key={i}
              src={f.iconUrl}
              alt={f.alt}
              className="size-11 object-contain drop-shadow-sm transition-transform hover:scale-110"
            />
          ))}
        </div>

        <Button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            open()
          }}
          className="gap-2"
        >
          <Upload className="size-4" />
          Browse Files
        </Button>
      </div>

      {/* 2. Upload progress kártyák */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Upload progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Folyamatban */}
          <Card className="p-4 space-y-3 shadow-sm border-amber-500/30 bg-amber-500/5">
            <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium truncate flex items-center gap-2">
                <FileText className="size-4 text-amber-500 shrink-0" />
                <span className="truncate">2026.pdf</span>
              </CardTitle>
              <Button variant="ghost" size="icon" className="size-6 text-muted-foreground hover:text-foreground shrink-0">
                <X className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 space-y-1.5">
               <Progress value={56} className="[&_[data-slot=progress-indicator]]:bg-amber-500" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className="text-amber-500 font-medium">Uploading...</span>
                <span className="font-medium text-foreground">56%</span>
              </div>
            </CardContent>
          </Card>

          {/* Hibás */}
          <Card className="p-4 space-y-3 shadow-sm border-rose-500/30 bg-rose-500/5">
            <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium truncate flex items-center gap-2">
                <FileText className="size-4 text-rose-500 shrink-0" />
                <span className="truncate">2025_reports.docx</span>
              </CardTitle>
              <AlertCircle className="size-4 text-rose-500 shrink-0" />
            </CardHeader>
            <CardContent className="p-0 space-y-1.5">
              <Progress value={78} className="[&_[data-slot=progress-indicator]]:bg-rose-500" />
              <div className="flex justify-between text-xs text-rose-500 font-medium">
                <span>Upload failed</span>
                <span>78%</span>
              </div>
            </CardContent>
          </Card>

          {/* Kész */}
          <Card className="p-4 space-y-3 shadow-sm border-emerald-500/30 bg-emerald-500/5">
            <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium truncate flex items-center gap-2">
                <FileText className="size-4 text-emerald-500 shrink-0" />
                <span className="truncate">2021_metadata.txt</span>
              </CardTitle>
              <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
            </CardHeader>
            <CardContent className="p-0 space-y-1.5">
              <Progress value={100} className="[&_[data-slot=progress-indicator]]:bg-emerald-500" />
              <div className="flex justify-between text-xs text-emerald-500 font-medium">
                <span>Completed</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Data Table */}
      <DataTable columns={columns} data={documents} />
    </div>
  )
}
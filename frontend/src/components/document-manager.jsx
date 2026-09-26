import React from "react"
import { Search, SlidersHorizontal, Filter, Upload, FileText, X, CheckCircle2, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

const fileTypes = [
  { alt: "PDF", iconUrl: "/icons/pdf-icon.svg" },
  { alt: "Docs", iconUrl: "/icons/doc-icon.svg" },
  { alt: "Txt", iconUrl: "/icons/txt-icon.svg" },
]

export function DocumentManager() {
  const { acceptedFiles, getRootProps, getInputProps, open } = useDropzone({
    noClick: false,
  })

  const files = acceptedFiles.map((file) => (
    <li key={file.path || file.name} className="flex items-center gap-2">
      <FileText className="size-4 text-primary" />
      <span>{file.path || file.name} - {file.size} bytes</span>
    </li>
  ))

  return (
    <div className="w-full space-y-6">
      {/* Eszköztár */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        <Select defaultValue="all">
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents</SelectItem>
            <SelectItem value="pdf">PDF Files</SelectItem>
            <SelectItem value="docx">Word Documents</SelectItem>
            <SelectItem value="txt">Text Files</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 pr-9"
          />
          <SlidersHorizontal className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4 text-muted-foreground" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Date Added</DropdownMenuItem>
            <DropdownMenuItem>File Size</DropdownMenuItem>
            <DropdownMenuItem>Alphabetical</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={open} className="gap-2">
          <Upload className="size-4" />
          Upload Document
        </Button>
      </div>

      {/* Dropzone */}
      <section className="space-y-6">
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

        {files.length > 0 && (
          <aside className="rounded-lg border p-4 bg-card">
            <h4 className="font-semibold text-sm mb-2">Files:</h4>
            <ul className="text-xs space-y-2 text-muted-foreground">{files}</ul>
          </aside>
        )}

        {/* Upload progress kártyák */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Upload progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Kártya: Folyamatban lévő feltöltés (Sárga / Amber) */}
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
                <Progress value={56} className="h-1.5 bg-amber-500/20">
                  <ProgressLabel className="sr-only">Upload progress</ProgressLabel>
                  <ProgressValue className="sr-only" />
                </Progress>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="text-amber-500 font-medium">Uploading...</span>
                  <span className="font-medium text-foreground">56%</span>
                </div>
              </CardContent>
            </Card>

            {/* 2. Kártya: Megszakadt / Hibás feltöltés (Piros / Rose) */}
            <Card className="p-4 space-y-3 shadow-sm border-rose-500/30 bg-rose-500/5">
              <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium truncate flex items-center gap-2">
                  <FileText className="size-4 text-rose-500 shrink-0" />
                  <span className="truncate">2025_reports.docx</span>
                </CardTitle>
                <AlertCircle className="size-4 text-rose-500 shrink-0" />
              </CardHeader>

              <CardContent className="p-0 space-y-1.5">
                <Progress value={78} className="h-1.5 bg-rose-500/20">
                  <ProgressLabel className="sr-only">Upload progress</ProgressLabel>
                  <ProgressValue className="sr-only" />
                </Progress>
                <div className="flex justify-between text-xs text-rose-500 font-medium">
                  <span>Upload failed</span>
                  <span>78%</span>
                </div>
              </CardContent>
            </Card>

            {/* 3. Kártya: Sikeresen befejezve (Zöld / Emerald) */}
            <Card className="p-4 space-y-3 shadow-sm border-emerald-500/30 bg-emerald-500/5">
              <CardHeader className="p-0 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium truncate flex items-center gap-2">
                  <FileText className="size-4 text-emerald-500 shrink-0" />
                  <span className="truncate">2021_metadata.txt</span>
                </CardTitle>
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
              </CardHeader>

              <CardContent className="p-0 space-y-1.5">
                <Progress value={100} className="h-1.5 bg-emerald-500/20">
                  <ProgressLabel className="sr-only">Upload progress</ProgressLabel>
                  <ProgressValue className="sr-only" />
                </Progress>
                <div className="flex justify-between text-xs text-emerald-500 font-medium">
                  <span>Completed</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Táblázat */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">2026.pdf</TableCell>
                <TableCell className="text-amber-500 font-medium">Uploading (56%)</TableCell>
                <TableCell>2.4 MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">2025_reports.docx</TableCell>
                <TableCell className="text-rose-500 font-medium">Failed (78%)</TableCell>
                <TableCell>1.1 MB</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">2021_metadata.txt</TableCell>
                <TableCell className="text-emerald-500 font-medium">Completed</TableCell>
                <TableCell>15 KB</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  )
}
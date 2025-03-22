"use client"

import React, { useState, useRef } from "react"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import DwvComponent from "./DwvComponent"

const FileManager = () => {
  const [files, setFiles] = useState([])
  const [selectedFileIndex, setSelectedFileIndex] = useState(null)
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      const newFiles = Array.from(event.target.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }))

      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
    if (selectedFileIndex === index) {
      setSelectedFileIndex(null)
    } else if (selectedFileIndex > index) {
      setSelectedFileIndex(selectedFileIndex - 1)
    }
  }

  const handleSelectFile = (index) => {
    setSelectedFileIndex(index)
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / 1048576).toFixed(2) + " MB"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      }))

      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  return (
    <div className="flex flex-col h-full border rounded-lg shadow-sm bg-card">
      <div className="flex p-4 border-b">
        <h2 className="text-xl font-semibold flex-grow">File Manager</h2>
      </div>

      <div className="flex h-[calc(100%-4rem)]">
        <div
          className={cn("w-72 border-r bg-muted/40", isDragging && "bg-primary/5 border-primary/20")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-4">
            <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
            <Button className="w-full" onClick={() => fileInputRef.current.click()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Files
            </Button>
          </div>

          <ScrollArea className="h-[calc(100%-4rem)]">
            {files.length > 0 ? (
              <div>
                {files.map((file, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Separator />}
                    <div
                      className={cn(
                        "hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                        selectedFileIndex === index && "bg-accent/50",
                      )}
                    >
                      <div
                        className="px-4 py-3 flex justify-between items-center"
                        onClick={() => handleSelectFile(index)}
                      >
                        <div className="overflow-hidden">
                          <p className="font-medium truncate">{file.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {`${formatFileSize(file.size)} • ${file.type || "Unknown type"}`}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFile(index)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete file</span>
                        </Button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-muted-foreground">Drop files here or click "Add Files" to upload.</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex-grow p-4 h-[600px] overflow-hidden">
          {selectedFileIndex !== null ? (
            <DwvComponent
              key={"dwvcomp" + selectedFileIndex}
              fileToLoad={files[selectedFileIndex].file}
              hideDropbox={true}
            />
          ) : (
            <div className="flex justify-center items-center h-full">
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-10 px-6">
                  <p className="text-muted-foreground text-center">Select a file from the list to view</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileManager


"use client"

import { useState, useRef } from "react"
import { Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import DwvComponent from "./DwvComponent"

// Placeholder viewer component
const FileViewer = ({ file }) => {
    return (
        <div className="bg-muted/40 rounded-lg p-6 flex items-center justify-center min-h-[300px]">
            <div className="text-center">
                <DwvComponent
                    key={"dwvcomp" + file?.name}
                    fileToLoad={file}
                    hideDropbox={true}
                />
            </div>
        </div>
    )
}

// Helper function to format file size
const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else return (bytes / 1048576).toFixed(2) + " MB"
}

export default function PredictPage() {
    const [file, setFile] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [result, setResult] = useState(null)
    const fileInputRef = useRef(null)

    // Handle file upload
    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)
            startPrediction()
        }
    }

    // Handle drag events
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
            const droppedFile = e.dataTransfer.files[0]
            setFile(droppedFile)
            startPrediction()
        }
    }

    // Start prediction process
    const startPrediction = () => {
        setIsLoading(true)
        setProgress(0)
        setResult(null)

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + 5
            })
        }, 150)

        // Show result after 3 seconds
        setTimeout(() => {
            clearInterval(interval)
            setProgress(100)

            // Random result
            const hasStroke = Math.random() > 0.5
            setResult({
                hasStroke,
                confidence: (Math.random() * 30 + 70).toFixed(2), // Random confidence between 70-100%
            })

            setIsLoading(false)
        }, 3000)
    }

    // Reset everything
    const handleReset = () => {
        setFile(null)
        setIsLoading(false)
        setProgress(0)
        setResult(null)
    }

    return (
        <div className="py-10">
            <div className="space-y-4 text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight">Stroke Prediction</h1>
                <p className="text-muted-foreground max-w-[700px] mx-auto">
                    Upload a brain scan image to predict the likelihood of stroke. Our AI model will analyze the image and provide
                    a prediction.
                </p>
                <Separator className="my-4 mx-auto w-[100px]" />
            </div>

            <div className="max-w-3xl mx-auto">
                {!file ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Scan Image</CardTitle>
                            <CardDescription>Drag and drop your file or click to browse</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center",
                                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                                )}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                                <h3 className="font-medium text-lg mb-1">Drag & drop your file here</h3>
                                <p className="text-sm text-muted-foreground mb-4">Supported formats: DICOM, JPG, PNG</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".dcm,.jpg,.jpeg,.png"
                                />
                                <Button onClick={() => fileInputRef.current.click()}>Browse Files</Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Analysis Results</CardTitle>
                                    <CardDescription>{isLoading ? "Processing your scan..." : "Prediction complete"}</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" onClick={handleReset}>
                                    Upload New Scan
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <FileViewer file={file} />

                            {isLoading && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Analyzing scan</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                    <p className="text-sm text-muted-foreground flex items-center justify-center mt-2">
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Please wait while we analyze your scan...
                                    </p>
                                </div>
                            )}

                            {result && (
                                <Alert variant={result.hasStroke ? "destructive" : "default"}>
                                    <div className="flex items-start">
                                        {result.hasStroke ? (
                                            <AlertCircle className="h-5 w-5 mr-2" />
                                        ) : (
                                            <CheckCircle className="h-5 w-5 mr-2" />
                                        )}
                                        <div>
                                            <AlertTitle className="text-lg">
                                                {result.hasStroke ? "Stroke Detected" : "No Stroke Detected"}
                                            </AlertTitle>
                                            <AlertDescription>
                                                <p className="mt-1">
                                                    Our model predicts {result.hasStroke ? "a high" : "a low"} likelihood of stroke with{" "}
                                                    {result.confidence}% confidence.
                                                </p>
                                                <p className="mt-2 text-sm">
                                                    <strong>Note:</strong> This is a demonstration only. Always consult with a medical
                                                    professional for accurate diagnosis.
                                                </p>
                                            </AlertDescription>
                                        </div>
                                    </div>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">Analysis powered by Green Matter AI</CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}


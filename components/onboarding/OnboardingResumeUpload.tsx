import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"
import { Upload, FileText, X, Loader2 } from "lucide-react"


export function OnboardingResumeUpload() {
  const router = useRouter()
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      // Auto-generate title from filename
      const nameWithoutExt = uploadedFile.name.replace(/\.[^/.]+$/, "")
      setTitle(nameWithoutExt)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  const removeFile = () => {
    setFile(null)
    setTitle("")
  }

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a file and provide a title.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    try {
      // Mock upload process
      console.log("Uploading file:", file.name, "with title:", title)
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate upload

      toast({
        title: "Resume Uploaded!",
        description: "Your resume has been successfully uploaded and processed.",
      })
      
      router.push("/onboarding/job-description")
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      {!file ? (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-primary/50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {isDragActive ? "Drop your resume here" : "Upload your resume"}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your resume file here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, and DOCX files up to 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* File Preview */
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume Title Input */}
      {file && (
        <div className="space-y-2">
          <Label htmlFor="title">Resume Title</Label>
          <Input
            id="title"
            placeholder="e.g., Software Engineer Resume 2024"
            value={title}
            onChange={(e: { target: { value: any } }) => setTitle(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Give your resume a descriptive title to help you identify it later
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={handleUpload}
          disabled={!file || !title.trim() || isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resume
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => router.push("/onboarding/job-description")}
        >
          Skip for Now
        </Button>
      </div>
    </div>
  )
}

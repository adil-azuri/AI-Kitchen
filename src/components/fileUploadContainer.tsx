import { useState } from "react"
import FileUpload from "./fileUpload"
import { toast } from 'sonner'

export interface filePreview {
    file: File
    preview: string | null
    progress: number
    error?: string
    success?: boolean

}

function FileUploadContainer() {
    const [files, setFiles] = useState<filePreview[]>([])

    const handleChange = (newFiles: filePreview[]) => {
        setFiles(newFiles)
    }
    const handleRemove = (file: filePreview) => {
        toast.success(`${file.file.name} removed successfully`)
    }

    return (
        <div className="w-full">
            <FileUpload
                value={files}
                onChange={handleChange}
                onRemove={handleRemove}
                maxFiles={1}
                maxSize={20}
                accept={{
                    "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
                    "application/pdf": [".pdf"]

                }}
            />
        </div>
    )
}
export default FileUploadContainer
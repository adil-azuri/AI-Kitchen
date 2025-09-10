import { filePreview } from "./fileUploadContainer"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils";
import Textarea from '@mui/joy/Textarea';
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { useCallback, useState } from "react";
import { FileIcon, Loader2Icon, Upload, X } from "lucide-react";
import { getAiResult } from "@/app/api/getAiResponse";
import Image from 'next/image';

interface FileUploadProps {
    value?: filePreview[],
    onChange?: (files: filePreview[]) => void,
    onRemove?: (file: filePreview) => void,
    maxFiles?: number
    maxSize?: number
    accept?: { [key: string]: string[] }
    disabled?: boolean
    className?: string
}

function FileUpload({
    value = [],
    onChange,
    onRemove,
    maxFiles = 1,
    maxSize = 20,
    accept = {
        "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
        "application/pdf": [".pdf"]
    },
    disabled = false,
}: FileUploadProps) {
    const [files, setFiles] = useState<filePreview[]>(value)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [prompt, setPrompt] = useState<string>("")
    const [aiResult, setAiResult] = useState<string>("")

    const createFilePreview = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader()
                reader.onload = () => {
                    resolve(reader.result as string)
                }
                reader.readAsDataURL(file)
            } else {
                resolve(null)
            }
        })
    }

    const simulateUpload = (filePreview: filePreview) => {
        let progress = 0
        const interval = setInterval(() => {
            progress += 5
            setFiles((prevFiles) =>
                prevFiles.map((f) =>
                    f.file === filePreview.file ? { ...f, progress: Math.min(progress, 100) } : f
                )
            )
            if (progress >= 100) {
                clearInterval(interval)
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        f.file === filePreview.file ? { ...f, success: true } : f
                    )
                )
            }
        }, 100)
    }

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const newFiles: filePreview[] = []

            for (const file of acceptedFiles) {
                if (files.length + newFiles.length >= maxFiles) {
                    break
                }
                const preview = await createFilePreview(file)
                const newFilePreview: filePreview = {
                    file,
                    preview,
                    progress: 0
                }
                newFiles.push(newFilePreview)
                simulateUpload(newFilePreview)
            }

            const updatedFiles = [...files, ...newFiles]
            setFiles(updatedFiles)
            onChange?.(updatedFiles)
        },
        [files, maxFiles, onChange]
    )

    const {
        getRootProps,
        getInputProps,
        isDragActive,
    } = useDropzone({
        onDrop,
        accept,
        maxSize: maxSize * 1024 * 1024,
        multiple: true,
        disabled: disabled || files.length >= maxFiles
    })

    const handleRemove = useCallback((fileToRemove: filePreview) => {
        const updatedFiles = files.filter((f) => f.file !== fileToRemove.file)
        setFiles(updatedFiles)
        onChange?.(updatedFiles)
        onRemove?.(fileToRemove)
    },
        [files, onRemove, onChange])

    const onSubmit = async () => {
        setIsLoading(true);
        const file = files.length > 0 ? files[0].file : undefined;
        const result = await getAiResult(prompt, file);
        setAiResult(result);
        setIsLoading(false);
    }

    return (
        <div className="flex flex-col gap-5">
            <Card className="backdrop-blur-md bg-white/30">
                <CardHeader>
                    <CardTitle>File Upload</CardTitle>
                    <CardDescription><span className="text-black"> Drag and drop file or click to upload</span></CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div
                        {...getRootProps()}
                        className={cn(
                            "relative flex flex-col items-center justify-center w-full h-30 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                            disabled && "opacity-50 cursor-not-allowed",
                            "hover:bg-muted/50"
                        )}
                    >
                        <input {...getInputProps()} />
                        <div className="flex flex-col justify-center items-center py-6">
                            <Upload className="size-8 mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Drag file here or click to upload </p>
                        </div>
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={`${file.file.name}-${index}`}
                                    className="flex items-center justify-between rounded-lg p-3 border"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        {file.preview ? (
                                            <div className="size-16 overflow-hidden rounded-md flex-shrink-0">
                                                <Image
                                                    src={file.preview}
                                                    alt={file.file.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover w-full h-full"
                                                />

                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center size-16 rounded-md bg-gray-100 flex-shrink-0">
                                                <FileIcon className="size-8 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="truncate font-medium text-sm pr-2">
                                            {file.file.name}
                                        </div>
                                    </div>

                                    <button
                                        className="bg-gray-200 text-gray-600 rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                        onClick={() => handleRemove(file)}
                                        disabled={disabled}
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="flex w-full justify-between">
                        <p className="text-xs text-black">
                            {`${files.filter((f) => !f.error).length}/${maxFiles} files uploaded`}
                        </p>
                    </div>
                </CardFooter>
            </Card>

            <div className="flex flex-col gap-5">

                <div className="flex items-end gap-4 w-full p-4 rounded-xl backdrop-blur-md bg-slate-900/50 border border-slate-700">
                    <Textarea
                        color="neutral"
                        minRows={1}
                        size="lg"
                        variant="soft"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Mau Masak Apa hari ini? "
                        className="flex-grow w-full text-slate-200 bg-slate-800/80 border-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-sky-500"
                    />

                    <button
                        disabled={isLoading}
                        onClick={onSubmit}
                        className="flex items-center justify-center bg-sky-600 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2Icon className="size-5 animate-spin" />
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>


                {aiResult && (
                    <div className="backdrop-blur-md bg-sky-900/50 border border-sky-700 shadow-xl p-5 mt-4 rounded-xl text-white">
                        <h3 className="text-lg font-bold text-sky-100 mb-2 underline">AI Result :</h3>
                        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                            {aiResult}
                        </p>
                    </div>
                )}
            </div>
        </div >
    )
}

export default FileUpload

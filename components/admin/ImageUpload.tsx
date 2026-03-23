"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  bucket?: "products" | "blog" | "recipes"
}

export default function ImageUpload({ value, onChange, disabled, bucket = "products" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return

      // Basic validation
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }

      setUploading(true)
      
      const formData = new FormData()
      formData.append("file", file)
      formData.append("bucket", bucket)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const { url } = await response.json()
      onChange(url)
      toast.success("Image uploaded successfully")
    } catch (error: any) {
      console.error("Upload error:", error)
      toast.error(error.message || "Error uploading image")
    } finally {
      setUploading(false)
    }
  }

  const onRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-4 w-full flex flex-col items-center justify-center">
      {value ? (
        <div className="relative w-full aspect-square max-w-[300px] rounded-md overflow-hidden border group">
          <div className="z-10 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              type="button" 
              onClick={onRemove} 
              variant="destructive" 
              size="icon"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            fill
            className="object-cover"
            alt="Product Image"
            src={value}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full min-h-[150px] border-2 border-dashed rounded-md bg-gray-50 border-gray-200 hover:border-green-400 hover:bg-green-50/30 transition-all">
          <Input
            type="file"
            accept="image/*"
            disabled={disabled || uploading}
            onChange={onUpload}
            className="hidden"
            id="image-upload"
          />
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-6 space-y-2 text-gray-500 hover:text-green-600 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader2 className="h-10 w-10 animate-spin text-green-600" />
                <span className="text-sm font-medium">Uploading...</span>
              </div>
            ) : (
              <>
                <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold">Click to upload</span>
                  <p className="text-xs mt-1 text-gray-400">PNG, JPG, WebP up to 5MB</p>
                </div>
              </>
            )}
          </Label>
        </div>
      )}
    </div>
  )
}

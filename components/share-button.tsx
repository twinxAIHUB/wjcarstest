"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Facebook, Twitter, Linkedin, Mail, Link2, Share2, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ShareButtonProps {
  url: string
  title: string
  description: string
}

export default function ShareButton({ url, title, description }: ShareButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url

  const shareData = {
    title,
    text: description,
    url: fullUrl,
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setIsCopied(true)

    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    })

    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <>
      {typeof navigator !== "undefined" && typeof navigator.share === "function" ? (
        <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Share</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex w-full items-center"
              >
                <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Share on Facebook
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex w-full items-center"
              >
                <Twitter className="mr-2 h-4 w-4 text-blue-400" /> Share on Twitter
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer flex w-full items-center"
              >
                <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> Share on LinkedIn
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this vehicle: ${description}\n\n${fullUrl}`)}`}
                className="cursor-pointer flex w-full items-center"
              >
                <Mail className="mr-2 h-4 w-4 text-gray-600" /> Share via Email
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-600" /> Copied!
                </>
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" /> Copy Link
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}

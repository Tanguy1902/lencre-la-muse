"use client";

import { CldUploadWidget } from "next-cloudinary";
import Button from "./Button";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
}

/**
 * Injects Cloudinary on-the-fly transformations into an upload URL.
 * Converts: .../upload/v123/file.jpg → .../upload/c_limit,w_1200,q_auto,f_auto/v123/file.jpg
 * This gives us: auto format (webp/avif), auto quality, max 1200px width.
 */
function optimizeCloudinaryUrl(url: string): string {
  const transformations = "c_limit,w_1200,q_auto,f_auto";
  return url.replace("/upload/", `/upload/${transformations}/`);
}

export default function ImageUpload({ onUpload, value }: ImageUploadProps) {
  return (
    <CldUploadWidget
      uploadPreset="ml_default2"
      onSuccess={(result) => {
        if (result.event === "success" && typeof result.info === "object" && result.info && "secure_url" in result.info) {
          const rawUrl = (result.info as Record<string, unknown>).secure_url as string;
          onUpload(optimizeCloudinaryUrl(rawUrl));
        }
      }}
      options={{
        maxFiles: 1,
        maxFileSize: 10_000_000, // 10MB max
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "avif"],
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1"
          },
          fonts: {
            default: null,
            "'Fira Sans', sans-serif": "https://fonts.googleapis.com/css?family=Fira+Sans"
          }
        }
      }}
    >
      {({ open }) => {
        return (
          <div className="flex flex-col gap-4">
            {value ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-outline-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="Firakotra" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onUpload("")}
                  className="absolute right-2 top-2 rounded-full bg-surface/80 p-1 text-primary hover:bg-surface"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="secondary"
                className="flex w-full items-center justify-center gap-2 border-dashed py-12"
                onClick={() => open()}
              >
                <span className="material-symbols-outlined text-[24px]">add_photo_alternate</span>
                Hampiditra sary firakotra
              </Button>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
}

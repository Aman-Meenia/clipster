"use client";

import { Film, Image as ImageIcon } from "lucide-react";

interface CampaignHeroProps {
  images: string[];
  name: string;
  activeImage: number;
  onImageChange: (index: number) => void;
}

export default function CampaignHero({
  images,
  name,
  activeImage,
  onImageChange,
}: CampaignHeroProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#14161F] border border-white/5">
      {images.length > 0 ? (
        <>
          <div className="relative h-[220px] sm:h-[320px] md:h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImage]}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-linear-to-t from-[#0B0C10] to-transparent" />
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 p-3 sm:p-4 pt-0 -mt-14 sm:-mt-16 relative z-10 overflow-x-auto scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => onImageChange(i)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    i === activeImage
                      ? "border-red-500 shadow-lg shadow-red-500/20"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="h-[160px] sm:h-[200px] flex items-center justify-center">
          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white/10" />
        </div>
      )}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function ImageGallery() {
  return (
    <div className="flex items-center gap-2 h-[400px] w-full max-w-5xl mt-10 px-4 mx-auto">
      {[
        "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
      ].map((src, idx) => (
        <div
          key={idx}
          className="relative group flex-grow transition-all w-56 rounded-lg overflow-hidden h-[400px] duration-500 hover:w-full"
        >
          <img
            className="h-full w-full object-cover object-center"
            src={src}
            alt={`image-${idx}`}
          />
        </div>
      ))}
    </div>
  );
}

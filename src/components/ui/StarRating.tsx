"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number; // size of star icon
  className?: string;
}

export function StarRating({ rating, onRatingChange, readonly = false, size = 24, className }: StarRatingProps) {
  const totalStars = 5;

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            size={size}
            className={cn(
              "cursor-pointer transition-colors",
              starValue <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300",
              readonly && "cursor-default",
              !readonly && starValue <= rating && "hover:text-yellow-500",
            )}
            onClick={() => !readonly && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={!readonly && onRatingChange ? (e) => { /* Optional hover effect */ } : undefined}
            onMouseLeave={!readonly && onRatingChange ? (e) => { /* Optional hover effect */ } : undefined}
          />
        );
      })}
    </div>
  );
}

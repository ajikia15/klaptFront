import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface LaptopTagsProps {
  tags: string[];
  className?: string;
}

export const LaptopTags: React.FC<LaptopTagsProps> = ({ tags = [], className = "" }) => {
  if (!tags || tags.length === 0) return null;
  
  // Define color mappings for different tag types
  const getTagColor = (tag: string): string => {
    const tag_lower = tag.toLowerCase();
    switch (tag_lower) {
      case "gaming":
        return "bg-red-600/40 hover:bg-red-500/50";
      case "productivity":
      case "business":
        return "bg-blue-600/40 hover:bg-blue-500/50";
      case "budget":
        return "bg-green-600/40 hover:bg-green-500/50";
      case "creative":
        return "bg-purple-600/40 hover:bg-purple-500/50";
      case "ultrabook":
        return "bg-cyan-600/40 hover:bg-cyan-500/50";
      default:
        return "bg-neutral-600/40 hover:bg-neutral-500/50";
    }
  };

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tags.map((tag, index) => (
        <Badge 
          key={`${tag}-${index}`} 
          className={`${getTagColor(tag)} font-medium text-xs flex items-center gap-0.5 transition-colors cursor-default`}
        >
          <Tag size={10} className="mr-0.5" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default LaptopTags;
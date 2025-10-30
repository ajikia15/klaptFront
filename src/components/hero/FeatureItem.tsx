import React from "react";

type Props = { children: React.ReactNode };

export default function FeatureItem({ children }: Props) {
  return (
    <div className="mb-2 cursor-pointer overflow-hidden rounded duration-300 ease-in-out hover:scale-105">
      {children}
    </div>
  );
}


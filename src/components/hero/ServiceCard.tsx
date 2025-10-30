import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ServiceCard() {
  return (
    <div className="min-w-64 group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-700">
      <img
        src="/static/maintenance.jpg"
        className="h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:blur-sm group-hover:brightness-50"
        alt=""
      />
      {/* Overlay for extra darken/blur on hover */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-500 ease-out group-hover:bg-black/60"
        style={{ backdropFilter: "none" }}
      />
      {/* Layer 1: Title at bottom, fades out on hover */}
      <span className="logo-text absolute bottom-0 left-0 z-20 p-3 text-lg font-bold text-white opacity-100 drop-shadow ease-out group-hover:opacity-0">
        Test any System
      </span>
      {/* Layer 2: Overlay card, appears on hover only */}
      <div className="pointer-events-none absolute inset-0 z-30 flex h-full w-full flex-col opacity-0 transition-opacity duration-500 ease-out group-hover:pointer-events-auto group-hover:opacity-100">
        <span className="logo-text mb-3 mt-7 px-3 text-center text-base font-bold text-white opacity-90 drop-shadow transition-all duration-700">
          Test any System
        </span>
        <div className="mx-auto mb-2 w-11/12 text-center text-sm text-neutral-100 text-opacity-90 transition-all duration-700">
          Service description goes here. Add your short text...
        </div>
        <div className="flex-grow" />
        <div className="mx-3 mb-3 flex w-full items-center justify-between rounded-full border border-neutral-700 bg-neutral-900 bg-opacity-70 p-1 pl-4 font-semibold transition-all duration-700">
          CONTACT US
          <Button
            variant="ghost"
            className="h-8 w-8 rounded-full bg-neutral-900"
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
}

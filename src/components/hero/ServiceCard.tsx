import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ServiceCard() {
  return (
    <div className="min-w-64 group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-xl bg-neutral-700">
      <img
        src="/static/maintenance.jpg"
        className="absolute inset-0 z-0 h-full w-full object-cover object-center transition-all duration-500 ease-out group-hover:blur-sm group-hover:brightness-50"
        alt=""
      />
      <div
        className={
          "pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-neutral-900/70 to-neutral-900/10 transition-all duration-500 ease-out group-hover:bg-neutral-900/60 group-hover:from-neutral-900/70 group-hover:to-neutral-900/10"
        }
        style={{ backdropFilter: "none" }}
      />
      <span className="logo-text absolute bottom-0 left-0 right-0 z-20 p-4 text-lg font-bold text-white opacity-100 drop-shadow transition-opacity duration-500 ease-out group-hover:opacity-0">
        Test any System
      </span>
      <div className="pointer-events-none absolute inset-0 z-20 flex h-full w-full flex-col p-3 opacity-0 transition-opacity duration-500 ease-out group-hover:pointer-events-auto group-hover:opacity-100">
        <span className="logo-text mb-3 mt-7 px-3 text-center text-base font-bold text-white opacity-90 drop-shadow transition-all duration-700">
          Test any System
        </span>
        <div className="mx-auto mb-2 w-11/12 text-center text-sm text-neutral-100 text-opacity-90 transition-all duration-700">
          Service description goes here. Add your short text...
        </div>
        <div className="flex-grow" />
        <div className="flex w-full items-center justify-between rounded-full border border-neutral-700 bg-neutral-900 bg-opacity-70 p-1 pl-4 font-semibold transition-all duration-700">
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

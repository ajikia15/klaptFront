import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroMarquee() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-neutral-800">
      {/* Desktop Layout - Backdrop Logo/Text with Absolute Positioned Marquees */}
      <div className="hidden h-full sm:block">
        {/* Backdrop Logo - Left Center */}
        <div className="absolute left-0 top-1/2 z-0 flex -translate-y-1/2 items-center justify-start p-8">
          <img
            src="/logo-white.svg"
            alt="Kaido Logo"
            className="h-64 w-auto opacity-5 md:h-80 lg:h-96"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-evenly gap-2 border-t border-neutral-600 bg-neutral-800 px-5 py-3">
        <div className="flex flex-1 items-center justify-between rounded-full bg-neutral-900 p-1 pl-4 font-semibold">
          SHOP NOW
          <Button variant="secondary" className="h-8 w-8 rounded-full">
            <ArrowRight className="" />
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-between rounded-full border border-neutral-700 p-1 pl-4 font-semibold">
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

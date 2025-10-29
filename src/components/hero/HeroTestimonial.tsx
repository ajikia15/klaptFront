import HelperSearchBar from "./HelperSearchBar";
export default function HeroTestimonial() {
  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-xl bg-neutral-800">
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4">
        <HelperSearchBar />
      </div>
      {/* <div className="absolute bottom-0 left-0 right-0 flex items-center justify-evenly gap-2 border-t border-neutral-600 bg-neutral-800 px-5 py-3">
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
      </div> */}
    </div>
  );
}

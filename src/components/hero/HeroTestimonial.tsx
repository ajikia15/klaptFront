import HelperSearchBar from "./HelperSearchBar";
import ServiceCard from "./ServiceCard";
export default function HeroTestimonial() {
  return (
    <div className="relative flex h-full w-full flex-col justify-around overflow-hidden rounded-xl bg-neutral-800 p-6">
      <h2 className="logo-text text-2xl font-semibold">Kaido's Services</h2>
      <div className="flex flex-row gap-2 overflow-x-hidden rounded-xl">
        <ServiceCard
          title="Testing"
          description="Kaido offers on-site testing of the verified and unverified systems. We provide free support on the Kaido verified items. For unverified systems, you can arrange a visit from our technicians - ANYWHERE in Tbilisi."
          image="/static/testing2.jpg"
        />
        <ServiceCard
          title="Repair"
          description="Our qualified technicians are ready to help you with any hardware or software issues you may have."
          image="/static/repairv1.png"
        />
        <ServiceCard
          title="Software Installation"
          description="Our qualified technicians are ready to set up systems with any software/games you want. You can also bring your own hardware and we will install it for you."
          image="/static/software1.png"
        />
        <ServiceCard
          title="Upgrade"
          description="You may request upgrade of your an item for more RAM and SSD storage, at the best prices."
          image="/static/ram.png"
        />
      </div>
      <HelperSearchBar />
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

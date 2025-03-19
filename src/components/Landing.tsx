import { ArrowRight } from "@deemlol/next-icons";
export default function Landing() {
  return (
    <section className="  grid grid-cols-4 w-full">
      <div className="col-span-1 bg-neutral-800 rounded-lg p-4 box-border border-neutral-700 border">
        <ul className="flex flex-col gap-4">
          <li className="flex justify-between items-center">
            <span>Asus</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Lenovo</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>MSI</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Acer</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>HP</span>
            <ArrowRight size={18} />
          </li>
          <li className="flex justify-between items-center">
            <span>Dell</span>
            <ArrowRight size={18} />
          </li>
        </ul>
      </div>
      <div className="col-span-3">i hate niggers</div>
    </section>
  );
}

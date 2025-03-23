interface FlashCardProps {
  title: string;
  discount: number;
  image: string;
}

export const FlashCard = ({ title, discount, image }: FlashCardProps) => {
  return (
    <div className="bg-primary-900 p-4 rounded-lg aspect-[4/5] md:aspect-square relative flex flex-col gap-2">
      <span className="text-lg">Up to</span>
      <p className="text-xl font-semibold text-white">
        <span className="text-6xl font-bold bg-gradient-to-r inline  text-transparent bg-clip-text from-secondary-400 to-white">
          {discount}%
        </span>
        &nbsp;off
      </p>

      <h3 className="font-bold text-2xl">{title}</h3>
      <img
        src={image}
        alt={title}
        className="aspect-square w-1/2  rounded absolute bg-black -right-2 -bottom-2"
      />
    </div>
  );
};

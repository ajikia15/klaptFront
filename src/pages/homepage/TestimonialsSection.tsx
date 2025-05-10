import { useTranslation } from "react-i18next";

const TestimonialsSection = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-neutral-800 px-4 py-12">
      <div className="container mx-auto">
        <h2 className="mb-8 text-center text-3xl font-bold text-white">
          {t("testimonials.heading")}
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg bg-neutral-900 p-6 shadow-lg">
              {/* Stars */}
              <div className="mb-4 flex">
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <svg
                      key={j}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
              </div>
              <p className="mb-4 italic text-neutral-300">
                "{t(`testimonials.review${i}`)}"
              </p>
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-700 font-bold text-white">
                  {t(`testimonials.initials${i}`)}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">
                    {t(`testimonials.name${i}`)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {t(`testimonials.role${i}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

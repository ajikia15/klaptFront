const TestimonialsSection = () => {
  return (
    <section className="py-10 bg-gradient-to-br from-neutral-800/70 to-neutral-900/90 border-y border-neutral-800 mt-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          What Our Customers Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700/50 relative"
            >
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex mb-4">
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
                <p className="text-neutral-300 mb-4 italic">
                  "
                  {
                    [
                      "Amazing selection of gaming laptops with competitive prices.",
                      "The support team was incredibly helpful in helping me choose the right laptop for my needs.",
                      "Fast shipping and the laptop was exactly as described. Highly recommend!",
                    ][i - 1]
                  }
                  "
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold">
                    {["JD", "AM", "RK"][i - 1]}
                  </div>
                  <div className="ml-3">
                    <p className="text-white font-medium">
                      {["John D.", "Alex M.", "Rachel K."][i - 1]}
                    </p>
                    <p className="text-neutral-500 text-sm">
                      {
                        ["Gaming Enthusiast", "Designer", "Software Developer"][
                          i - 1
                        ]
                      }
                    </p>
                  </div>
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

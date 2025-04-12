const NewsletterSection = () => {
  return (
    <section className="container mx-auto py-10 mt-4">
      <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 rounded-2xl p-6 md:p-8 border border-primary-700/30 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated particles/dots background */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-20 h-20 bg-secondary-500/20 rounded-full blur-[40px] animate-pulse"></div>
            <div
              className="absolute bottom-20 left-20 w-16 h-16 bg-primary-500/20 rounded-full blur-[30px] animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-500/20 rounded-full blur-[20px] animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated on Latest Tech
          </h2>
          <p className="text-neutral-300 mb-8">
            Subscribe to our newsletter and be the first to know about new
            laptop releases, exclusive deals and tech tips
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-3 rounded-lg bg-neutral-800/80 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 transition-all duration-300 focus:bg-neutral-800"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-gradient-to-r from-secondary-600 to-primary-600 hover:from-secondary-700 hover:to-primary-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-secondary-900/20"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

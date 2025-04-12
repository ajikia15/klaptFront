const NewsletterSection = () => {
  return (
    <section className="container mx-auto py-12 px-4">
      <div className="bg-neutral-800 rounded-lg p-8 shadow-lg">
        <div className="max-w-3xl mx-auto text-center">
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
              className="flex-grow px-4 py-3 rounded-lg bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
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

import { Button } from "@/components/ui/button";

const NewsletterSection = () => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-lg bg-neutral-800 p-8 shadow-lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Stay Updated on Latest Tech
          </h2>
          <p className="mb-8 text-neutral-300">
            Subscribe to our newsletter and be the first to know about new
            laptop releases, exclusive deals and tech tips
          </p>

          <form className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow rounded-lg bg-neutral-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button
              type="submit"
              className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-all hover:bg-primary-700"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;

import {
  PlusCircle,
  Edit3,
  Eye,
  ArrowRight,
  BookOpen,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

const Home = () => {
  // Custom Color Constants
  const brandGreen = "text-[#55aa00]";
  const bgBrandGreen = "bg-[#55aa00]";
  const borderBrandGreen = "border-[#55aa00]";

  return (
    <main className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-32 overflow-hidden">
        {/* Abstract Background Glow */}
        <div
          className={`absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full ${bgBrandGreen} opacity-10 blur-[100px]`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full ${bgBrandGreen} opacity-5 blur-[100px]`}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 mb-8 backdrop-blur-sm">
              <Sparkles size={14} className={brandGreen} />
              <span className="text-2xs md:text-xs font-bold uppercase tracking-[0.2em]">
                The Creator's Canvas
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[0.95]">
              Capture Ideas. <br />
              <span className={`${brandGreen}`}>Publish Impact.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              The seamless platform to{" "}
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                add
              </span>{" "}
              your stories,
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                edit
              </span>{" "}
              with precision, and
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {" "}
                see
              </span>{" "}
              your influence grow.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <button
                className={`${bgBrandGreen} hover:bg-[#448800] text-white px-10 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl shadow-[#55aa00]/30 transition-all hover:-translate-y-1 active:scale-95`}
              >
                Start a Post <PlusCircle size={22} />
              </button>
              <button className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 hover:border-[#55aa00] dark:hover:border-[#55aa00] px-10 py-5 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 group">
                Browse Feed{" "}
                <ArrowRight
                  size={22}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID (Add, Edit, See) --- */}
      <section className="py-20 bg-white/30 dark:bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Add Section */}
            <div className="group relative p-10 bg-gray-100 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-300 dark:border-gray-700 overflow-hidden transition-all hover:shadow-2xl">
              <div
                className={`absolute top-0 right-0 p-4 opacity-10 ${brandGreen}`}
              >
                <PlusCircle size={120} />
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${bgBrandGreen} flex items-center justify-center mb-8 text-white shadow-lg`}
              >
                <PlusCircle size={24} />
              </div>
              <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">
                Add Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Draft rich articles with ease. Our interface is designed to get
                out of your way and let your creativity flow.
              </p>
            </div>

            {/* Edit Section */}
            <div className="group relative p-10 bg-gray-100 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-300 dark:border-gray-700 overflow-hidden transition-all hover:shadow-2xl">
              <div
                className={`absolute top-0 right-0 p-4 opacity-10 ${brandGreen}`}
              >
                <Edit3 size={120} />
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${bgBrandGreen} flex items-center justify-center mb-8 text-white shadow-lg`}
              >
                <Edit3 size={24} />
              </div>
              <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">
                Refine & Edit
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Stories evolve. Update your headlines, change taglines, and
                polish your posts at any time with one click.
              </p>
            </div>

            {/* See Section */}
            <div className="group relative p-10 bg-gray-100 dark:bg-gray-800/50 rounded-[2.5rem] border border-gray-300 dark:border-gray-700 overflow-hidden transition-all hover:shadow-2xl">
              <div
                className={`absolute top-0 right-0 p-4 opacity-10 ${brandGreen}`}
              >
                <Eye size={120} />
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${bgBrandGreen} flex items-center justify-center mb-8 text-white shadow-lg`}
              >
                <Eye size={24} />
              </div>
              <h3 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">
                See Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Visualize your reach. See all your posts in a beautiful grid
                designed for maximum readability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRENDING PREVIEW --- */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Discover <span className={brandGreen}>Latest</span> Posts
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              Handpicked stories from the Postly community.
            </p>
          </div>
          <button
            className={`flex items-center gap-3 font-bold py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-[#55aa00] hover:text-white transition-all`}
          >
            Explore All <TrendingUp size={18} />
          </button>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <article
              key={item}
              className="group cursor-pointer bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-300 dark:border-gray-700 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-2xl"
            >
              <div className="aspect-video bg-gray-300 dark:bg-gray-700 relative overflow-hidden">
                <div
                  className={`absolute inset-0 ${bgBrandGreen} opacity-10 group-hover:opacity-20 transition-opacity`}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen size={48} className={`${brandGreen} opacity-40`} />
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-2xs  font-bold uppercase tracking-widest bg-gray-200 dark:bg-gray-900 ${brandGreen}`}
                  >
                    Tech
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    5 min read
                  </span>
                </div>
                <h4 className="text-2xl font-bold mb-3 group-hover:text-[#55aa00] transition-colors line-clamp-2">
                  10 Tips for Writing Cleaner React Code
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                  Discover the best practices that top developers use to keep
                  their components manageable and highly performant...
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-400"></div>
                    <span className="text-xs font-bold">Alex Rivera</span>
                  </div>
                  <ArrowRight
                    size={18}
                    className={`${brandGreen} opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1`}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* --- QUICK ACTION STRIP --- */}
      <section className="pb-24 px-4">
        <div
          className={`max-w-5xl mx-auto rounded-[3rem] p-12 text-center bg-gray-900 border border-gray-800 shadow-2xl relative overflow-hidden`}
        >
          <div
            className={`absolute -bottom-10 -left-10 w-40 h-40 ${bgBrandGreen} opacity-20 blur-3xl`}
          ></div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">
            Ready to tell your story?
          </h2>
          <button
            className={`${bgBrandGreen} text-white px-12 py-5 rounded-2xl font-extrabold text-xl flex items-center gap-3 mx-auto hover:scale-105 transition-transform`}
          >
            Create Post Now <Zap size={22} fill="currentColor" />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;

import React from "react";
import { Lightbulb, Share2, Cpu, Rocket, ArrowRight } from "lucide-react";

const About = () => {
  const brandGreen = "text-[#55aa00]";
  const bgBrandGreen = "bg-[#55aa00]";
  const borderBrandGreen = "border-[#55aa00]";

  const coreValues = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Creativity",
      desc: "We provide the canvas; you bring the color. Postly is designed to let your creative spark fly without technical hurdles.",
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Share Stories",
      desc: "Every voice matters. We've built a seamless ecosystem where your stories reach the readers who care most.",
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "Tech-Driven",
      desc: "Leveraging modern web standards to ensure your content is fast, responsive, and future-proof.",
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Innovation",
      desc: "We aren't just a blog; we are an evolving platform constantly pushing the boundaries of digital publishing.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* --- Section 1: Introduction --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2
                className={`text-sm font-bold uppercase tracking-[0.3em] mb-4 ${brandGreen}`}
              >
                Behind the Platform
              </h2>
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase italic tracking-tighter">
                The Future of <br />
                <span className={brandGreen}>Digital Expression.</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed max-w-xl">
                Postly was born from a simple idea: that technology should never
                get in the way of a good story. We've combined high-end
                innovation with a minimalist aesthetic to give creators the home
                they deserve.
              </p>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <div
                className={`h-40 md:h-64 rounded-3xl ${bgBrandGreen} opacity-20 flex items-center justify-center`}
              >
                <span className={`text-6xl font-black ${brandGreen}`}>P</span>
              </div>
              <div className="h-40 md:h-64 rounded-3xl bg-gray-300 dark:bg-gray-800 border border-gray-400 dark:border-gray-700 flex items-end p-6">
                <p className="font-bold text-xl uppercase tracking-tighter">
                  Postly v1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Concepts Bento Grid --- */}
      <section className="py-20 bg-gray-300/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase tracking-tighter">
              Built on Four Pillars
            </h2>
            <div
              className={`h-1.5 w-24 ${bgBrandGreen} mx-auto rounded-full`}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-gray-200 dark:bg-gray-900 rounded-4xl border border-gray-300 dark:border-gray-800 hover:border-[#55aa00] transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-2xl hover:shadow-[#55aa00]/10"
              >
                <div
                  className={`${brandGreen} mb-6 transition-transform group-hover:scale-110 duration-300`}
                >
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 uppercase tracking-tight">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: The Mission Statement --- */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${bgBrandGreen} opacity-5 blur-[120px] rounded-full`}
        ></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-6xl font-bold mb-10 leading-snug">
            "Our mission is to empower the next generation of{" "}
            <span className={brandGreen}>tech-savvy writers</span> to share
            stories that spark innovation."
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-px bg-gray-400"></div>
            <p className="font-bold uppercase tracking-[0.2em] text-gray-500">
              The Postly Team
            </p>
            <div className="w-12 h-px bg-gray-400"></div>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="pb-20 px-4 text-center">
        <button
          className={`${bgBrandGreen} hover:bg-[#448800] text-white px-12 py-5 rounded-full font-black text-xl uppercase tracking-widest flex items-center gap-4 mx-auto transition-all shadow-xl shadow-[#55aa00]/20`}
        >
          Join the Movement <ArrowRight size={24} />
        </button>
      </section>
    </div>
  );
};

export default About;

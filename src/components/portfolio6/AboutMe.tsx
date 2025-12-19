import Image from "next/image";

export default function AboutMe() {
  return (
    <section className="relative w-full py-20 font-montserrat bg-black">
      
      {/* Background image */}
      <div className="absolute inset-0 flex justify-center overflow-hidden">
        <div className="w-full max-w-[1450px] relative">
          <Image
            src="/assets/portfolio/heroimage.png"
            alt="About background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
      </div>

      {/* Content wrapper — THIS DEFINES ALIGNMENT */}
      <div className="relative z-10 mx-auto max-w-[1450px] px-2 sm:px-4 lg:px-12">

        {/* Title */}
        <h2 className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#FCC92F] mb-8">
          ABOUT ME
        </h2>

        {/* Text */}
        <div className="mx-auto w-full lg:max-w-5xl">
          <p
            className="text-center text-white leading-relaxed"
            style={{
              fontSize: "clamp(13px, 3.2vw, 18px)",
            }}
          >
            Creative and detail-oriented Graphic Designer with [X] years of
            experience in brand identity, social media design, and marketing
            visuals. Adept at transforming concepts into compelling visuals
            that enhance brand presence. Proficient in Adobe Creative Suite,
            Canva, and Figma, with a strong understanding of design principles
            and user experience. Passionate about delivering high-quality
            designs that resonate with audiences and drive engagement.
          </p>
        </div>

      </div>
    </section>
  );
}

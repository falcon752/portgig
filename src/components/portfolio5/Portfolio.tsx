import Image from "next/image";

export default function Portfolio() {
  return (
    <section className="relative bg-[#f9f9f9] overflow-hidden py-40 flex items-center justify-center">

      {/* Left Decorative SVG */}
      <div className="absolute -left-40 top-1/2 transform -translate-y-1/2">
        <Image
          src="/assets/jlj1.svg"
          alt="Left decorative element"
          width={500}
          height={500}
        />
      </div>

      {/* Right Decorative SVG */}
      <div className="absolute -right-40 top-1/2 transform -translate-y-1/2">
        <Image
          src="/assets/jlj2.svg"
          alt="Right decorative element"
          width={500}
          height={500}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-10 max-w-4xl">
        <h2 className="text-[#1E2A5A] font-bold text-3xl md:text-5xl lg:text-6xl mb-4">
          My Content Creation
        </h2>
        <h1 className="text-[#F9C221] font-extrabold text-5xl md:text-7xl lg:text-8xl">
          Portfolio
        </h1>
      </div>

    </section>
  );
}

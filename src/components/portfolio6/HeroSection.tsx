import Image from "next/image";

export default function HeroSection() {
  return (
    <div className="w-full bg-black font-montserrat">
      {/* === Overlayed Section (text + image) === */}
      <div className="relative w-full py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/bg.png"
            alt="Background portrait"
            fill
            className="object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-black opacity-80" />
        </div>

        {/* Content with overlay behind */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Left Section */}
            <div className="lg:w-1/2 text-white">
              <h1 className="text-2xl md:text-4xl font-bold lg:text-9xl tracking-tight">ADEOLA</h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#FFBA00] mb-6 lg:mt-0">GIWA</h2>
              <div className="mb-6">
                <p className="uppercase text-lg lg:text-4xl tracking-wide mb-1">
                  PHOTOGRAPHY/
                </p>
                <p className="uppercase text-lg lg:text-4xl tracking-wide mb-1">
                  CINEMATOGRAPHER
                </p>
                <p className="text-sm lg:text-xl">Lagos State</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="lg:w-1/2 flex justify-end mt-8 lg:mt-0">
              <div className="bg-white p-4 max-w-md">
                <Image
                  src="/assets/hero.png"
                  alt="Photographer portrait"
                  width={500}
                  height={500}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Non-overlay Section (cards) === */}
      <div className="container mx-auto px-4 mt-10 lg:mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-300 aspect-square"></div>
          <div className="bg-gray-300 aspect-square"></div>
          <div className="bg-gray-300 aspect-square"></div>
        </div>
      </div>
    </div>
  );
}
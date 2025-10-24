import Image from "next/image";

export default function Portfolio() {
  return (
    <div className="bg-black flex items-center justify-center overflow-hidden py-40">
      <div className="relative flex flex-col items-center justify-center">
        <div className="absolute -left-70 top-1/10 transform -translate-y-1/2">
          <Image
            src="/assets/jlj1.svg"
            alt="Left decorative element"
            width={500}
            height={500}
          />
        </div>

        {/* Content */}
        <div className="z-10">
          {/* Top text */}
          <div className="text-white text-xl lg:text-4xl md:text-5xl font-bold text-center mb-2">
            My Content Creation
          </div>

          {/* Bottom text with larger font */}
          <div className="text-yellow-400 text-xl lg:text-6xl md:text-7xl font-bold text-center">
            Portfolio
          </div>
        </div>

        <div className="absolute -right-78 top-1/2 transform -translate-y-1/2">
          <Image
            src="/assets/jlj2.svg"
            alt="Right decorative element"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
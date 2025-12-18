import Image from "next/image";

export default function PortfolioTemplateHero() {
  return (
    <section className="bg-[#f9f9f9] flex flex-col items-center px-6 py-20 text-center">

      {/* Avatar */}
      <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-[#7fd3f7]">
        <Image
          src="/assets/girl.png"
          alt="Sophia Turner"
          fill
          className="object-cover"
        />
      </div>

      {/* Name */}
      <h1 className="mt-8 text-[60px] sm:text-[75px] md:text-[90px] font-medium font-[MTNBrighterSans] leading-[1.83] tracking-normal whitespace-nowrap text-black">
        Sophia Turner
      </h1>

      {/* Role */}
      <p className="-mt-6 text-base md:text-lg font-semibold text-gray-700">
        Strategic Social Media Manager, Lagos
      </p>

    </section>
  );
}

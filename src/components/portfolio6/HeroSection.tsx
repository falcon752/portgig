import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-black font-montserrat">

      {/* ================= DESKTOP HERO ================= */}
      <div className="container mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="hidden lg:flex flex-row items-center justify-between gap-16">
          <div className="text-white lg:w-1/2 w-full text-left">
            <h1 className="text-[96px] 2xl:text-[96px] xl:text-[72px] lg:text-[60px] font-extrabold leading-tight whitespace-nowrap">
              ADEOLA GIWA
            </h1>
            <p className="mt-4 font-bold text-xl 2xl:text-xl xl:text-lg lg:text-base uppercase tracking-wider text-[#FCC92F] whitespace-nowrap">
              Photography / Cinematographer · Lagos State
            </p>
          </div>

          <div className="lg:w-1/2 w-full flex justify-end">
            <div className="bg-white p-4 max-w-md w-full rounded-lg overflow-hidden">
              <Image
                src="/assets/hero.png"
                alt="Adeola Giwa portrait"
                width={500}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLET LAYOUT USED FOR ALL BELOW 1024px ================= */}
      <div className="flex flex-col items-center text-center lg:hidden px-6 py-12 -mt-25">
        <div className="w-full mb-10">
          <div className="bg-white p-4 w-full max-w-sm rounded-lg overflow-hidden mx-auto">
            <Image
              src="/assets/hero.png"
              alt="Adeola Giwa portrait"
              width={500}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>

        <h1 className="text-white text-5xl sm:text-6xl font-extrabold mb-2 leading-tight whitespace-nowrap">
          ADEOLA GIWA
        </h1>
        <p className="text-[#FCC92F] text-[12px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">

          Photography / Cinematographer · Lagos State
        </p>
      </div>
    </section>
  );
}

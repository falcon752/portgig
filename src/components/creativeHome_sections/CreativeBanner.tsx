import Image from "next/image"

const CreativeBanner = () => {
  return (
    <>
      {/* Desktop / Tablet View */}
      <section className="flex justify-center text-white mt-20 mb-5 max-md:hidden">
        <main
          className="
            w-full max-w-[1200px]
            bg-primary rounded:none
            flex flex-row items-stretch
            overflow-hidden
            mx-auto
            h-fit
          "
        >
          <div className="flex-1 flex flex-col justify-center items-start gap-5 py-5 px-10 font-raleway">
            <h2 className="text-xl lg:text-3xl font-extrabold text-white">
              Take the Next Step – Find Opportunities, Build Your Network, Get Hired!
            </h2>
            <p className="text-sm font-bold text-white">
              Explore top jobs, showcase your portfolio, and connect with different people in your field.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <Image src="/assets/bell.png" alt="creativehero" width={300} height={200} />
          </div>
        </main>
      </section>

      {/* Mobile View */}
      <section className="flex justify-center text-white md:hidden lg:mt-20 mb-5">
        <main
          className="
            w-full max-w-[1200px]
            bg-primary rounded md:rounded-3xl
            flex flex-row items-center gap-4
            font-raleway
            overflow-hidden
            py-8 px-4
          "
        >
          <div className="flex-1 text-left space-y-3">
            <h2 className="text-[10px] font-extrabold text-white leading-tight">
              Take the Next Step – Find Opportunities, Build Your Network, Get Hired!
            </h2>
            <p className="text-[10px] font-bold text-white leading-relaxed">
              Explore top jobs, showcase your portfolio, and connect with different people in your field.
            </p>
          </div>

          <div className="shrink-0 w-32 h-32 relative">
            <Image src="/assets/bell.png" alt="creativehero" fill className="object-contain" />
          </div>
        </main>
      </section>
    </>
  )
}

export default CreativeBanner

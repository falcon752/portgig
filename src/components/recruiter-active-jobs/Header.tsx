import Image from "next/image";

export function Header() {
  return (
    <header className="relative overflow-x-hidden">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 pt-4 md:pt-6 pb-2">
        {/* Top left - Dashboard */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-sm text-black">
            <Image
              src="/assets/Vector.png"
              alt="Dashboard icon"
              width={20}
              height={20}
              className="w-4 h-4 md:w-5 md:h-5"
            />
            <span className="text-sm md:text-lg lg:text-2xl font-bold font-raleway text-[#0A1754]">
              Dashboard
            </span>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row items-end justify-between gap-4">
          <h1 className="w-full text-left pb-0 lg:pb-3 text-sm md:text-xl lg:text-3xl max-lg:pt-10 font-bold text-[#0A1754] font-raleway">
            Active Jobs
          </h1>

          <div className="hidden md:flex items-center justify-center shrink-0">
            <Image
              src="/assets/creative.svg"
              alt="Creative image"
              width={200}
              height={200}
              className="w-full h-auto max-w-[120px] md:max-w-[140px] lg:max-w-[200px]"
            />
          </div>
        </div>
      <div className="absolute bottom-0 left-0 w-full border-b border-black max-md:hidden" />
      </div>
    </header>
  );
}
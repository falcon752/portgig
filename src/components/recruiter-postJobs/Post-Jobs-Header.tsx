import Image from "next/image";

export function PostJobHeader() {
  return (
    <header className="relative">
      <div className="max-w-7xl w-full mx-auto px-3 pt-4 pb-0 lg:pb-0 lg:px-6">
        <div className="mb-3">
          {/* Top left - Dashboard */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-black">
              <Image
                src="/assets/Vector.png"
                alt="Dashboard icon"
                width={20}
                height={20}
              />
              <span className="text-sm lg:text-2xl font-bold font-raleway">
                Dashboard
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between w-full px-4 lg:px-10 lg:gap-4">
            {/* Left: Title */}
            <h1 className="text-sm lg:text-3xl max-md:mt-10 font-bold text-[#0A1754] font-raleway w-full lg:w-auto text-left">
              Post Job
            </h1>

            <div className="flex-1 flex justify-center">
              <button className="bg-[#0A1754] max-md:hidden text-base lg:text-xl px-4 lg:px-6 py-2 font-bold font-raleway text-white rounded-md whitespace-nowrap">
                Full Time Role
              </button>
            </div>

            <div className="hidden md:flex justify-end w-full lg:w-auto">
              <Image
                src="/assets/creative.svg"
                alt="Creative image"
                width={200}
                height={200}
                className="w-full h-auto max-w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full-width bottom border */}
      <div className="border-b border-black max-w-7xl mx-auto px-6" />

    </header>
  );
}

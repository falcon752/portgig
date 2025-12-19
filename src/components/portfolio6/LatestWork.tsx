import Image from "next/image";

export default function LatestWork() {
  return (
    <div className="bg-black text-white py-10">
      <div className="mx-auto max-w-[1450px] px-3 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <p className="text-white mb-2 text-base sm:text-lg md:text-xl font-inter">
            My Portfolio
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#FCC92F]">
            LATEST WORK
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-6">
          {["work1", "work2", "work3", "work4"].map((img, i) => (
            <div
              key={i}
              className="
                border-2 border-white
                overflow-hidden
                rounded-none
                md:rounded-md
                w-full
              "
            >
              <Image
                src={`/assets/portfolio/${img}.png`}
                alt={`Portfolio image ${i + 1}`}
                width={900}
                height={600}
                className="
                  w-full
                  h-[300px]
                  sm:h-[300px]
                  md:h-[260px]
                  lg:h-[300px]
                  object-cover
                "
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default function WeddingShoots() {
    return (
      <div className="text-white max-w-full mx-auto">
        <div className="space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16">
          {[
            { title: "WEDDING SHOOTS" },
            { title: "EVENTS SHOOTS" },
            { title: "BTS SHOOTS" },
            { title: "BIRTHDAY SHOOTS" },
          ].map((section, idx) => (
            <div key={idx} style={{ backgroundColor: "#232121" }} className="py-8 sm:py-10 md:py-12 lg:py-16">
              <div className="container max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-4">
                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
                  <div className="w-full md:w-1/2 flex justify-center md:justify-start">
                    <div
                      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[450px] h-[180px] sm:h-[200px] md:h-[220px] lg:h-[240px] xl:h-[260px]"
                      style={{ backgroundColor: "#D9D9D9" }}
                    ></div>
                  </div>
      
                  <div className="w-full md:w-1/2 md:pl-4 lg:pl-6 xl:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                      {section.title}
                    </h2>
                    <button className="bg-white text-black font-bold font-[inter] px-4 sm:px-5 md:px-6 lg:px-7 xl:px-8 py-2 sm:py-2.5 md:py-3 lg:py-3.5 rounded text-xs sm:text-sm md:text-base lg:text-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
                      View more Google Drive/Instagram
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
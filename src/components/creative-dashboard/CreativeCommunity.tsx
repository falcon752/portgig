"use client";

const CreativeCommunity = () => {
  return (
    <section className="bodyMargin flex flex-col gap-6 my-6 font-raleway px-4 sm:px-6 md:px-12">
      {/* Motivation Banner */}
      <div className="h-auto p-4 bg-[#0A1754] w-full flex flex-col items-start rounded-md py-5 lg:py-10 lg:pl-10 text-white">
        <h2 className="text-sm sm:text-lg md:text-xl lg:text-3xl font-bold">
          {"Didn't get the job? It's not you, it's them. Don't feel down."}
        </h2>
        <h2 className="text-sm sm:text-base mt-1 font-semibold">
          You will get the next one, hang in there...
        </h2>
      </div>

      {/* Community Section */}
      <div className="max-w-7xl mx-auto w-full text-primary flex flex-col rounded-md py-5 lg:pl-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center lg:text-left lg:mb-5 mb-6">
          You are not alone, Interact with other Creatives
        </h2>

        {/* Mobile and Desktop Layout */}
        <div className="flex flex-row justify-center lg:justify-between gap-4 sm:gap-6 lg:gap-60">
          {/* Discord */}
          <div className="flex flex-col items-center gap-3 text-center w-full lg:w-[48%]">
            <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-[#00489A]">
              Discord community
            </h2>
            <button
              type="button"
              className="py-4 sm:py-6 px-4 sm:px-6 w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[440px] bg-primary text-white rounded text-sm sm:text-base lg:text-xl font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => {
                window.open("https://discord.gg/wCs38uXS", "_blank");
              }}
            >
              Join Here
            </button>
          </div>

          {/* Telegram */}
          <div className="flex flex-col items-center gap-3 text-center w-full lg:w-[48%]">
            <h2 className="text-sm sm:text-lg lg:text-xl font-semibold text-[#00489A]">
              Telegram community
            </h2>
            <button
              type="button"
              className="py-4 sm:py-6 px-4 sm:px-6 w-full max-w-[200px] sm:max-w-[220px] lg:max-w-[440px] bg-primary text-white rounded text-sm sm:text-base lg:text-xl font-semibold cursor-pointer hover:bg-primary/90 transition-colors"
              onClick={() => {
                window.open(
                  "https://t.me/portgigcreativescommunnity",
                  "_blank"
                );
              }}
            >
              Join Here
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CreativeCommunity;

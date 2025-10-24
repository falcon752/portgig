export default function PortfolioTemplateFiveAboutme() {
    return (
      <div className="bg-black text-white py-6">
        <h2 className="text-2xl font-bold inline-block mb-4 px-6 md:px-10">
          About me
        </h2>
  
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#1C1C1C] p-6 md:p-10 border-y border-[#F9C221] gap-6 md:gap-0">
          <div className="flex flex-col items-center leading-none">
            <span className="text-8xl md:text-9xl lg:text-[500px] font-bold">
              2
            </span>
            <span className="text-xl md:text-2xl lg:text-4xl font-semibold mt-[-10px] lg:mt-[-40px]">
              Years
            </span>
          </div>
  
          <div className="bg-[#D9D9D921] w-full max-w-[90%] md:max-w-[621px] h-auto md:h-[255px] lg:h-[355px] text-center text-sm lg:text-2xl p-6 md:p-8 rounded-md">
            Creative and detail-oriented Graphic Designer with [X] years of
            experience in brand identity, social media design, and marketing
            visuals. Adept at transforming concepts into compelling visuals that
            enhance brand presence. Proficient in Adobe Creative Suite, Canva, and
            Figma, with a strong understanding of design principles and user
            experience. Passionate about delivering high-quality designs that
            resonate with audiences and drive engagement.
          </div>
        </div>
      </div>
    );
  }
interface TemplateFiveStrategyContentProps {
  approachToStrategy: string;
  mission: string;
}

export default function StrategyContent({
  approachToStrategy,
  mission,
}: TemplateFiveStrategyContentProps) {
  return (
    <section className="bg-[#f9f9f9] px-6 py-12 space-y-12 text-center">
      {/* My Approach to Strategy Content */}
      <div className="space-y-6">
        <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-3 text-center">
          {" "}
          My Approach to Strategy Content
        </h3>

        <div className="w-full font-bold bg-white border border-[#7fd3f7] rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed">
          {approachToStrategy ||
            "Creative and detail-oriented Graphic Designer with years of experience in brand identity, social media design, and marketing visuals. Adept at transforming concepts into compelling visuals that enhance brand presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a strong understanding of design principles and user experience. Passionate about delivering high-quality designs that resonate with audiences and drive engagement."}
        </div>
      </div>

      {/* My Mission & Values */}
      <div className="space-y-6">
        <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-3 text-center">
          {" "}
          My Mission & Values
        </h3>
        <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-3 text-center">
          {" "}
          How You Help Brands Grow Online
        </h3>

        <div className="w-full font-bold bg-white border border-[#7fd3f7] rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed">
          {mission ||
            "I help brands grow online by creating thoughtful, results-driven strategies that connect with the right audience. My mission is to deliver consistent value through creativity, strategy, and clear communication while helping businesses build trust, visibility, and long-term growth."}
        </div>
      </div>
    </section>
  );
}

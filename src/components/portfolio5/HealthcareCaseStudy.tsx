export default function PortfolioHealthcareCaseStudy() {
  return (
    <section className="bg-[#f9f9f9] px-6 py-16 space-y-10">

      {/* Title */}
      <h2 className="text-lg font-bold text-[#1E2A5A] text-center">
        Healthcare Brand
      </h2>

      {/* Description */}
      <div className="w-full font-bold bg-white border border-[#7fd3f7] rounded-lg px-6 py-8 text-sm md:text-base text-gray-700 leading-relaxed text-center">
        Creative and detail-oriented Graphic Designer with years of experience in
        brand identity, social media design, and marketing visuals. Adept at
        transforming concepts into compelling visuals that enhance brand
        presence. Proficient in Adobe Creative Suite, Canva, and Figma, with a
        strong understanding of design principles and user experience.
        Passionate about delivering high-quality designs that resonate with
        audiences and drive engagement.
      </div>

      {/* Before & After */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3 text-center">
          <h3 className="text-sm font-bold text-[#1E2A5A]">Before</h3>
          <div className="aspect-square w-full bg-white border border-[#7fd3f7] rounded-lg" />
        </div>

        <div className="space-y-3 text-center">
          <h3 className="text-sm font-bold text-[#1E2A5A]">After</h3>
          <div className="aspect-square w-full bg-white border border-[#7fd3f7] rounded-lg" />
        </div>
      </div>

    </section>
  )
}

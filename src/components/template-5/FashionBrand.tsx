export default function FashionBrand() {
  return (
    <div className="border-y border-[#F9C221] mt-14">
      <div className="bg-[#0F172A] text-[#E2E8F0] px-4 py-12 md:px-10">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Fashion Brand</h2>

          {/* Description Card */}
          <div className="border-2 border-pink-500 bg-[#1E293B] text-[#E2E8F0] px-4 py-20 rounded-lg mb-10 shadow-lg">
            <p className="text-center text-sm sm:text-base leading-relaxed">
              Creative and detail-oriented Graphic Designer with [X] years of
              experience in brand identity, social media design, and marketing
              visuals. Adept at transforming concepts into compelling visuals
              that enhance brand presence. Proficient in Adobe Creative Suite,
              Canva, and Figma, with a strong understanding of design principles
              and user experience. Passionate about delivering high-quality
              designs that resonate with audiences and drive engagement.
            </p>
          </div>

          {/* Before & After */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center w-full md:w-1/2">
              <h3 className="font-bold text-lg mb-3">Before</h3>
              <div className="border-2 border-pink-500 bg-[#1E293B] aspect-square w-full max-w-xs mx-auto rounded-lg shadow-md" />
            </div>

            <div className="text-center w-full md:w-1/2">
              <h3 className="font-bold text-lg mb-3">After</h3>
              <div className="border-2 border-pink-500 bg-[#1E293B] aspect-square w-full max-w-xs mx-auto rounded-lg shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

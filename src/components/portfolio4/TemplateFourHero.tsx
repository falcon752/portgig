import Image from "next/image";

const PortfolioTemplateFourHero = () => {
  return (
    <section className="bg-[#faf7f3] px-5 md:px-10 lg:px-20 py-10 border-b border-[#E77C29]">
      <div className="flex items-center gap-6">
        
        {/* AVATAR */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
          <Image
            src="/assets/template4.png"
            alt="Sandy Adesewa"
            width={150}
            height={150}
            className="w-full h-full object-cover"
          />
        </div>

        {/* TEXT */}
        <div className="flex flex-col gap-1">
          <h1 className="text-lg md:text-xl font-semibold text-blue-900">
            Sandy Adesewa
          </h1>

          <p className="text-sm text-blue-700">
            Writer, Content Writer, Abuja
          </p>
        </div>

      </div>
    </section>
  );
};

export default PortfolioTemplateFourHero;

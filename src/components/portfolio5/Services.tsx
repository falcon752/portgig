export default function Services() {
    const services = [
      {
        title: "Ads/Campaign",
        border: "border-white",
      },
      {
        title: "Full Social Media Management (Instagram, Facebook, Twitter)",
        border: "border-[#A1242C]",
      },
      {
        title: "Graphics Designing/Video Editing",
        border: "border-[#F9C221]",
      },
      {
        title: "Content Strategy & Scheduling",
        border: "border-[#F9C221]",
      },
  
      {
        title: "Hashtag & Trend Research",
        border: "border-[#A1242C]",
      },
    ];
  
    return (
      <div className="bg-black text-white px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold lg:mt-60">
            Services I Offer
          </h2>
          {services.map((service, index) => (
            <div
              key={index}
              className={`bg-white text-black p-6 rounded-md border-6 ${service.border} font-bold text:xl lg:text-2xl text-center py-20 rounded`}
            >
              {service.title}
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold mt-16">
            Case Studies (How My Work Helped Brands)
          </h3>
        </div>
      </div>
    );
  }
export default function OtherServices() {
  const services = [
    "Ads / Campaign Management",
    "Full Social Media Management (Instagram, Facebook, Twitter)",
    "Graphics Designing & Video Editing",
    "Content Strategy & Scheduling",
    "Hashtag & Trend Research",
  ];

  return (
    <section className="bg-[#f9f9f9] px-6 py-12">
      {/* Section Title */}
      <h3 className="text-4xl font-black font-[MuseoSansRounded] text-[#0A1754] leading-none tracking-normal mb-3 text-center">
        Other Services
      </h3>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="
              bg-white
              border
              border-[#7fd3f7]
              rounded-lg
              px-6
              py-5
              text-sm
              text-gray-700
              font-bold
              leading-relaxed
              flex
              items-center
              min-h-[96px]
            "
          >
            {service}
          </div>
        ))}
      </div>
    </section>
  );
}

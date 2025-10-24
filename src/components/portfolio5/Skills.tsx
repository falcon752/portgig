import Image from "next/image";

export default function Skills() {
  const services = [
    "Social Media Strategy & Growth",
    "Content Creation (Graphics & Video)",
    "Copywriting & Caption Writing",
    "Community Management & Engagement",
    "Paid Ads & Social Media Marketing (Meta Ads, TikTok Ads, etc.)",
    "Hashtag & Trend Research",
    "Analytics & Performance Tracking",
  ];

  return (
    <div className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 px-6 lg:px-10 text-center lg:text-left">
          My Skill Set
        </h2>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-10 px-6 lg:px-10 py-10 bg-[#1C1C1C] text-white border-y border-[#F9C221]">
          <div className="w-full lg:w-1/2 space-y-6">
            {services.map((item, index) => (
              <p
                key={index}
                className="font-[Inter] font-medium text-base md:text-xl lg:text-2xl leading-snug text-center lg:text-left"
              >
                {item}
              </p>
            ))}
          </div>

          <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
            <Image
              src="/assets/star.svg"
              alt="Strategy Visual"
              width={500}
              height={500}
              className="object-cover rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
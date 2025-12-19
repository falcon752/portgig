export default function Skills() {
  const skills = [
    "Fashion & Editorial Photography",
    "Food Photography",
    "Sports or Action Photography",
    "Portrait & Event Photography",
    "Product & Commercial Photography",
    "Lighting & Studio Setup",
  ];

  return (
    <section className="w-full py-20 bg-black font-montserrat">
      
      {/* Title */}
      <h2 className="text-center text-2xl md:text-3xl lg:text-4xl font-bold text-[#FCC92F] mb-12">
        MY SKILLS
      </h2>

      {/* Skills Grid */}
      <div className="w-full max-w-[1450px] mx-auto px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-18 justify-center">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="border border-[#FCC92F]/40 bg-[#111] text-white 
                         flex items-center justify-center text-center 
                         px-6 py-10 hover:border-[#FCC92F] transition
                         max-w-[400px]"
            >
              <p className="text-sm md:text-base lg:text-lg">
                {skill}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

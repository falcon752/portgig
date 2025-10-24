export default function JobCategories() {
  const categories = [
    "Photography & Videography",
    "Design & Visual Arts",
    "Writing & Content Creation",
    "Marketing & Advertising",
    "Web & Software Development",
    "Music & Audio Production",
    "Content Creators",
    "3D/VFX/Animators",
    "Film & Entertainment",
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#00489A] mb-8 font-raleway">
        Job Categories/Industry
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="bg-[#0A1754] rounded-2xl p-8 cursor-pointer group h-32 flex items-center justify-center"
          >
            <p className="text-white text-[10px] sm:text-xl font-semibold leading-tight text-center">
              {category}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

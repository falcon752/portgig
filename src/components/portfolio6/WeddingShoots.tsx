export default function Portfolio() {
  return (
    <div className="bg-black min-h-screen text-white py-16">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-0">
        {/* Title */}
        <h1 className="text-center text-3xl md:text-4xl font-bold text-yellow-400 mb-20">
          MY PORTFOLIO
        </h1>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-24">
          {[
            "Events shoots",
            "Birthday shoots",
            "Bts shoots",
            "Wedding shoots",
          ].map((title, index) => (
            <div key={index} className="w-full">
              {/* Image */}
              <div className="w-full aspect-[5/3] bg-white rounded-xl mb-8"></div>

              {/* Label */}
              <p className="text-lg font-medium mb-5">{title}</p>

              {/* Button */}
              <button className="bg-yellow-400 text-black font-semibold px-7 py-3 rounded-md hover:bg-yellow-500 transition">
                View more on Google Drive
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

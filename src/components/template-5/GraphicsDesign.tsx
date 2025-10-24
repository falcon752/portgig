import Image from "next/image"

interface TemplateFiveGraphicsDesignProps {
  graphicsDesign: string[] 
}

export default function TemplateFiveGraphicsDesign({ graphicsDesign }: TemplateFiveGraphicsDesignProps) {
  return (
    <div className="bg-[#1C1C1C] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <p className="text-white font-bold text-sm md:text-lg lg:text-3xl text-left lg:pl-3 mb-6">Graphics Design</p>
        {graphicsDesign && graphicsDesign.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
            {graphicsDesign.map((imageUrl, index) => (
              <div key={index} className="flex flex-col">
                <div className="relative h-[320px] w-[320px] bg-[#D9D9D9] rounded shadow-md overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Graphic Design ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-700 text-sm">No Image</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-400">No graphic design examples to display.</p>
        )}
      </div>
    </div>
  )
}

import React from 'react'

const PortfolioGraphicsDesign = () => {
  return (
    <div className="bg-[#1C1C1C] flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <p className="text-white font-bold text-sm md:text-lg lg:text-3xl text-center lg:text-left lg:ml-5 mb-6">
          Graphics Design
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex flex-col">
              <div className="h-[320px] w-[320px] bg-[#D9D9D9] rounded shadow-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PortfolioGraphicsDesign;
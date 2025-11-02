import Image from "next/image"

const CreativeHero = () => {
  return (
    <section className="mx-auto max-w-[1200px] h-fit bg-primary my-5 gap-5 px-4">
      <div className="h-full flex flex-row">
        <div className="flex flex-col justify-center w-1/2 p-4 md:p-15">
          <h2 className="text-xs font-medium lg:text-xl text-white font-urbanist -ml-2 md:-ml-4">Discover Creatives</h2>
          <h2 className="text-xl md:text-3xl lg:text-5xl font-bold text-white">Connect. Collaborate.</h2>
          <p className="text-[8px] lg:text-xl font-light text-white font-urbanist">
            Find talent across industries and grow your network
          </p>
        </div>
        <div className="w-1/2 flex justify-end items-end">
          <Image
            src="/assets/creative-man.svg"
            alt="creativehero"
            width={400}
            height={400}
            className="object-contain rounded-br-2xl h-full max-h-42 sm:max-h-48 md:max-h-full"
          />
        </div>
      </div>
    </section>
  )
}

export default CreativeHero

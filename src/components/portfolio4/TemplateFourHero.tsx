import Image from 'next/image'

const PortfolioTemplateFourHero = () => {
  return (
    <section className='bg-darkBlue px-5 md:px-10 lg:px-20 pt-10 lg:pt-20 flex flex-col lg:flex-row gap-5 text-white'>
      <div className='flex flex-col w-full py-5'>
        <p className='text-yellow font-lancelot md:text-lg ml-10'>Hello</p>
        <h2 className='font-lateef text-4xl md:text-5xl lg:text-8xl ml-5 lg:ml-20'>
          I&apos;m Sandy
        </h2>
        <h2 className='font-lateef text-4xl md:text-5xl lg:text-8xl'>
          Adesewa
        </h2>
        <h2 className='font-inter text-yellow font-bold text-xs md:text-sm lg:text-lg'>
          Writer, Content Writer
        </h2>
        <h2 className='font-inter font-bold text-[10px] md:text-xs lg:text-sm'>
          Abuja
        </h2>
      </div>
      <div className='w-full lg:w-auto lg:min-w-[500px] h-64 md:h-80 lg:h-96 bg-white flex items-center justify-center overflow-hidden'>
        <Image
          src='/assets/template4.png'
          alt='A writer'
          className='w-full h-full object-cover'
          width={500}
          height={500}
        />
      </div>
    </section>
  )
}

export default PortfolioTemplateFourHero
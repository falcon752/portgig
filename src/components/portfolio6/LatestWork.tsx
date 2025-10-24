import Image from 'next/image'

export default function LatestWork() {
    return (
        <div className='bg-black text-white py-8 sm:py-10 md:py-12'>
            <div className='container mx-auto px-4 sm:px-6 md:px-8 lg:px-4'>
                <div className='text-center mb-8 sm:mb-10 md:mb-12'>
                    <p className='text-white mb-1 sm:mb-2 text-base sm:text-lg md:text-xl font-inter'>
                        My Portfolio
                    </p>
                    <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-[#FFBA00]'>
                        LATEST WORK
                    </h2>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-4 justify-center max-w-[960px] mx-auto'>
                    {['work1', 'work2', 'work3', 'work4'].map((img, i) => (
                        <div
                            key={i}
                            className='border-2 border-white overflow-hidden rounded-md max-w-[450px] mx-auto w-full'
                        >
                            <Image
                                src={`/assets/portfolio/${img}.png`}
                                alt={`Portfolio image ${i + 1}`}
                                width={450}
                                height={300}
                                className='w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[300px] object-cover'
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
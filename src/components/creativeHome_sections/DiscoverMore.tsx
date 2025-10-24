"use client"
import Image from "next/image"
import Link from "next/link"
import { Buttons } from "../export_components"

const DiscoverMore = () => {
  return (
    <section className="md:flex gap-10 bodyMargin bg-primary my-5 p-8 rounded-2xl text-white">
      {/* Desktop / Tablet View */}
      <div className="hidden md:flex gap-10 w-full">
        <div className="w-full flex flex-col gap-5 font-raleway">
          <div className="flex flex-col gap-3 md:gap-5">
            <h2 className="text-sm sm:text-3xl md:text-4xl font-black">
              Discover and Connect with Creatives in your Industry.
            </h2>
            <h2 className="text-xs md:text-xl font-bold">
              Make new Friends, Connect with your Tribe and bring magic to life
            </h2>
          </div>
          <div className="lg:mt-20 md:ml-10">
            <Link href="/creatives-hub">
              <Buttons
                label="Visit creative Hub"
                className="bg-white rounded-lg text-black lg:text-xl w-fit mb-10 md:mb-0 font-bold font-urbanist"
              />
            </Link>
          </div>
        </div>
        <div className="w-full center">
          <Image src="/assets/group-creative.png" alt="discover more creative" width={400} height={400} className="" />
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden flex-row items-center gap-4 w-full">
        {/* Text Content */}
        <div className="flex-1 flex flex-col gap-4 font-raleway">
          <div className="flex flex-col gap-2">
            <h2 className="text-[13px] font-black leading-tight">Discover and Connect with Creatives in your Industry.</h2>
            <h2 className="text-[8px] lg:text-sm font-semibold leading-relaxed">
              Make new Friends, Connect with your Tribe and bring magic to life
            </h2>
          </div>
          <div>
            <Link href="/creatives-hub">
              <Buttons
                label="Visit creative Hub"
                className="bg-white rounded-lg text-black text-[8px] w-fit font-bold font-urbanist"
              />
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="shrink-0 relative w-40 h-40">
          <Image src="/assets/group-creative.png" alt="discover more creative" fill className="object-contain"/>
        </div>
      </div>
    </section>
  )
}

export default DiscoverMore

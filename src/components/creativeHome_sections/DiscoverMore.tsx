"use client"
import Image from "next/image"
import Link from "next/link"
import { Buttons } from "../export_components"

const DiscoverMore = () => {
  return (
    <>
      {/* Desktop / Tablet View */}
      <section className="flex justify-center text-white my-5 max-md:hidden">
        <main
          className="
            w-full max-w-[1200px]
            bg-primary rounded md:rounded-3xl
            flex flex-row items-stretch gap-10
            overflow-hidden
            p-8
            mx-auto
          "
        >
          <div className="flex-1 flex flex-col gap-5 font-raleway">
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
          <div className="flex-1 flex items-center justify-center">
            <Image src="/assets/group-creative.png" alt="discover more creative" width={400} height={400} />
          </div>
        </main>
      </section>

      {/* Mobile View */}
      <section className="flex justify-center text-white md:hidden my-5">
        <main
          className="
            w-full max-w-[1200px]
            bg-primary rounded md:rounded-3xl
            flex flex-row items-center gap-4
            overflow-hidden
            p-4
            mx-auto
          "
        >
          <div className="flex-1 flex flex-col gap-4 font-raleway">
            <div className="flex flex-col gap-2">
              <h2 className="text-[13px] font-black leading-tight">
                Discover and Connect with Creatives in your Industry.
              </h2>
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

          <div className="shrink-0 relative w-40 h-40">
            <Image src="/assets/group-creative.png" alt="discover more creative" fill className="object-contain" />
          </div>
        </main>
      </section>
    </>
  )
}

export default DiscoverMore

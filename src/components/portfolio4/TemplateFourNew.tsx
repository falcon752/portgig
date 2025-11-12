// pages/TemplateFourNew.tsx
import React from "react";
import Head from "next/head";

const TemplateFourNew: React.FC = () => {
  return (
    <>
      <Head>
        <title>Writer's Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Noto+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                darkMode: "class",
                theme: {
                  extend: {
                    colors: {
                      "primary": "#da5e0b",
                      "background-light": "#f8f7f5",
                      "background-dark": "#221710",
                      "text-light": "#1c130d",
                      "text-dark": "#f8f7f5",
                      "subtle-light": "#9c6a49",
                      "subtle-dark": "#a39992",
                      "border-light": "#e8d9ce",
                      "border-dark": "#4a3c30",
                    },
                    fontFamily: {
                      "display": ["Newsreader", "serif"],
                      "sans": ["Noto Sans", "sans-serif"]
                    },
                    borderRadius: {
                      "DEFAULT": "0.125rem",
                      "lg": "0.25rem",
                      "xl": "0.5rem",
                      "full": "0.75rem"
                    },
                  },
                },
              }
            `,
          }}
        />
      </Head>
      <body className="bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
          <div className="layout-container flex h-full grow flex-col">
            <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-4 sm:px-6 md:px-10 py-3 font-display">
                  <div className="flex items-center gap-4">
                    <div className="size-4 text-text-light dark:text-text-dark">
                      <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_6_330)">
                          <path
                            clipRule="evenodd"
                            d="M24 0.757355L47.2426 24L24 47.2426L0.757355 24L24 0.757355ZM21 35.7574V12.2426L9.24264 24L21 35.7574Z"
                            fill="currentColor"
                            fillRule="evenodd"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6_330">
                            <rect fill="white" height="48" width="48"></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold tracking-[-0.015em]">Eleanor Vance</h2>
                  </div>
                  <nav className="hidden md:flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9">
                      <a
                        className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                        href="#services"
                      >
                        Services
                      </a>
                      <a
                        className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                        href="#projects"
                      >
                        Projects
                      </a>
                      <a
                        className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                        href="#contact"
                      >
                        Contact
                      </a>
                    </div>
                  </nav>
                </header>

                <main className="flex flex-col gap-16 md:gap-24 py-16 md:py-24">
                  {/* Hero Section */}
                  <section className="@container">
                    <div className="flex flex-col gap-8 px-4 py-10 @[864px]:flex-row @[864px]:items-center">
                      <div className="w-full @[864px]:w-2/5 flex-shrink-0">
                        <div
                          className="aspect-square bg-center bg-no-repeat bg-cover rounded-xl"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA0oqW1Xjlvh7cmXr_ObWYbXq7cOGHbSTZyoc2JKKm35tniUhPy4IpWgNSDIuqc6_0iIScTYJIWYXsdoOAyRFfxM6itbMAQifniRubh_oBYmd-ee1G3PauyhuhI2SZtiuGeNWSr31m5I5kM_S-HPJrtbnnvEtfq4Dyxy3HqE5mS-uMfSNo2VV70uE8EDyLnZKH5TqAYC8A8uwotxXgb8AP2RTNrDM1GJhKObcSCS1x3pHCB-Zv02vq1qCJ_fcwi5cX-FefqmP-YDZXo")',
                          }}
                          data-alt="Professional headshot of Eleanor Vance, a content strategist."
                        ></div>
                      </div>
                      <div className="flex flex-col gap-6 @[864px]:gap-8 @[864px]:justify-center">
                        <div className="flex flex-col gap-2 text-left font-display">
                          <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                            Eleanor Vance
                          </h1>
                          <p className="text-lg font-medium text-subtle-light dark:text-subtle-dark">
                            Content Strategist & Copywriter
                          </p>
                          <p className="font-sans text-sm font-normal leading-normal @[480px]:text-base pt-2">
                            Based in San Francisco, CA. I craft compelling narratives that drive measurable revenue and build lasting brand authority. My work is rooted in storytelling that connects, persuades, and converts.
                          </p>
                        </div>
                        <a
                          className="flex max-w-[280px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base hover:opacity-90 transition-opacity"
                          href="#contact"
                        >
                          Let's Discuss Your Project
                        </a>
                      </div>
                    </div>
                  </section>

                  {/* Services Section */}
                  <section id="services">
                    <h2 className="text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-4 pt-5 font-display">
                      Services I Offer
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                      {[
                        {
                          title: "SEO Content Strategy",
                          desc: "Driving organic traffic with data-informed content that ranks and resonates.",
                        },
                        {
                          title: "High-Conversion Copywriting",
                          desc: "Crafting persuasive copy for websites, landing pages, and ads that converts visitors.",
                        },
                        { title: "Ghostwriting", desc: "Capturing your unique voice for thought leadership articles and executive communications." },
                        { title: "Email Sequences", desc: "Developing engaging email campaigns that nurture leads and drive sales." },
                        { title: "Editorial Management", desc: "Overseeing your content calendar from ideation to publication with precision." },
                        { title: "Brand Messaging", desc: "Defining a clear and compelling brand voice that connects with your audience." },
                      ].map((service, idx) => (
                        <div
                          key={idx}
                          className="flex flex-1 flex-col gap-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-4"
                        >
                          <div className="flex flex-col gap-1">
                            <h3 className="text-base font-bold leading-tight font-display">{service.title}</h3>
                            <p className="text-subtle-light dark:text-subtle-dark text-sm font-normal leading-normal">{service.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Additional sections like Projects, Clients, Tools, Footer go here... */}
                  {/* For brevity, replicate the same JSX structure from your HTML into JSX */}
                </main>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default TemplateFourNew;

"use client";

import Image from "next/image";
import React, { useState } from "react";
import Head from "next/head";

const PortfolioTemplateFour = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const services = [
    {
      title: "SEO Content Strategy",
      desc: "Driving organic traffic with data-informed content that ranks and resonates.",
    },
    {
      title: "High-Conversion Copywriting",
      desc: "Crafting persuasive copy for websites, landing pages, and ads that converts visitors.",
    },
    {
      title: "Ghostwriting",
      desc: "Capturing your unique voice for thought leadership articles and executive communications.",
    },
    {
      title: "Email Sequences",
      desc: "Developing engaging email campaigns that nurture leads and drive sales.",
    },
    {
      title: "Editorial Management",
      desc: "Overseeing your content calendar from ideation to publication with precision.",
    },
    {
      title: "Brand Messaging",
      desc: "Defining a clear and compelling brand voice that connects with your audience.",
    },
  ];

  const projects = [
    { title: "Fintech App Launch", type: "Website & Ad Copy" },
    { title: "B2B SaaS Blog", type: "SEO Content Strategy" },
    { title: "E-commerce Brand Voice", type: "Brand Messaging" },
    { title: "CEO Thought Leadership", type: "Ghostwriting" },
    { title: "Health & Wellness Newsletter", type: "Email Sequences" },
    { title: "Product Launch Campaign", type: "High-Conversion Copywriting" },
  ];

  const tools = [
    "Grammarly",
    "Ahrefs / SEMrush",
    "Google Docs",
    "Asana",
    "Slack",
  ];

  const benefits = [
    {
      title: "Strategic Thinking",
      desc: "Content that aligns with your business goals and delivers measurable results.",
    },
    {
      title: "Timely Delivery",
      desc: "Reliable and professional service that respects your deadlines.",
    },
    {
      title: "A Collaborative Partner",
      desc: "Clear communication and a commitment to understanding your brand's voice.",
    },
  ];

  const handleScroll = (id: string) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
      </Head>

      <div className="bg-background-light dark:bg-background-dark font-sans text-text-light dark:text-text-dark">
        {/* Header */}
        <header className="flex items-center border-b border-border-light dark:border-border-dark px-4 sm:px-6 md:px-10 py-3 font-display">
          <div className="flex items-center gap-2">
            <div className="size-4 text-text-light dark:text-text-dark">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                    <rect fill="white" height="48" width="48" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-[-0.015em]">
              Eleanor Vance
            </h2>
          </div>

          {/* Desktop nav shifted to the right */}
          <nav className="hidden md:flex gap-12 ml-auto">
            <a
              href="#services"
              className="text-sm font-medium hover:text-[#da5e0b] dark:hover:text-[#da5e0b] transition-colors"
            >
              Services
            </a>
            <a
              href="#projects"
              className="text-sm font-medium hover:text-[#da5e0b] dark:hover:text-[#da5e0b] transition-colors"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-sm font-medium hover:text-[#da5e0b] dark:hover:text-[#da5e0b] transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile menu icon */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6 text-text-light dark:text-text-dark"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </header>

        <main className="pt-24">
          {/* Hero */}
          <section className="flex flex-col md:flex-row items-center gap-8 px-4 sm:px-6 md:px-12 lg:px-16 py-10 max-w-[1200px] mx-auto">
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="aspect-square rounded-xl overflow-hidden relative">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0oqW1Xjlvh7cmXr_ObWYbXq7cOGHbSTZyoc2JKKm35tniUhPy4IpWgNSDIuqc6_0iIScTYJIWYXsdoOAyRFfxM6itbMAQifniRubh_oBYmd-ee1G3PauyhuhI2SZtiuGeNWSr31m5I5kM_S-HPJrtbnnvEtfq4Dyxy3HqE5mS-uMfSNo2VV70uE8EDyLnZKH5TqAYC8A8uwotxXgb8AP2RTNrDM1GJhKObcSCS1x3pHCB-Zv02vq1qCJ_fcwi5cX-FefqmP-YDZXo"
                  alt="Professional headshot of Eleanor Vance, a content strategist."
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6 md:gap-8 md:justify-center">
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                Eleanor Vance
              </h1>
              <p className="text-lg font-medium text-subtle-light dark:text-subtle-dark">
                Content Strategist & Copywriter
              </p>
              <p className="text-sm md:text-base font-normal leading-normal pt-2">
                Based in San Francisco, CA. I craft compelling narratives that
                drive measurable revenue and build lasting brand authority. My
                work is rooted in storytelling that connects, persuades, and
                converts.
              </p>
              <button
                onClick={() => handleScroll("contact")}
                className="max-w-[280px] bg-[#da5e0b] text-white font-bold px-4 py-2 md:py-3 rounded-full hover:opacity-90 transition"
              >
                Let's Discuss Your Project
              </button>
            </div>
          </section>

          {/* Services */}
          <section
            id="services"
            className="py-10 px-4 sm:px-6 md:px-12 lg:px-16"
          >
            <h2 className="text-2xl font-bold mb-6">Services I Offer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-border-light dark:border-border-dark rounded-lg"
                >
                  <h3 className="font-bold">{service.title}</h3>
                  <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                    {service.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section
            id="projects"
            className="py-10 px-4 sm:px-6 md:px-12 lg:px-16"
          >
            <h2 className="text-2xl font-bold mb-6">Project Showcase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-border-light dark:border-border-dark rounded-lg flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold">{proj.title}</h3>
                    <p className="text-sm text-subtle-light dark:text-subtle-dark mt-1">
                      {proj.type}
                    </p>
                  </div>
                  <button className="mt-4 w-full bg-[#da5e0b] text-white py-2 rounded-full hover:opacity-90 transition">
                    View Case Study
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Tools */}
          <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-16 text-center">
            <h2 className="text-2xl font-bold mb-6">Tools I Use</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {tools.map((tool, idx) => (
                <span
                  key={idx}
                  className="text-subtle-light dark:text-subtle-dark"
                >
                  {tool}
                </span>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="py-10 px-4 sm:px-6 md:px-12 lg:px-16">
            <div className="max-w-3xl mx-auto border border-border-light dark:border-border-dark rounded-xl p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                What You Get Working With Me
              </h2>
              <ul className="space-y-4">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#da5e0b] mt-1">
                      check_circle
                    </span>
                    <div>
                      <h4 className="font-bold">{b.title}</h4>
                      <p className="text-sm text-subtle-light dark:text-subtle-dark">
                        {b.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="py-16 px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to start your project?
            </h2>
            <a
              href="mailto:hello@eleanorvance.com"
              className="inline-block bg-[#da5e0b] text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition mb-4"
            >
              Let's Connect
            </a>
            <p className="text-sm">
              View more work on{" "}
              <a href="#" className="font-bold text-[#da5e0b] hover:underline">
                LinkedIn
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </>
  );
};

export default PortfolioTemplateFour;

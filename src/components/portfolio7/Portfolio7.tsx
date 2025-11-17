import React from "react";
import {
  Linkedin,
  Mail,
  Globe,
  Calendar,
  Briefcase,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Portfolio7 = () => {
  return (
    <div className="relative flex h-auto w-full flex-col group/design-root overflow-x-hidden bg-white font-display text-text-light">
      {/* HeroSection */}
      <div className="@container">
        <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
          <div
            className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPbDktbJbYwi6TsPugaleqhGfdRoK66iEUxYnZIAW0CxzwhE-mqXvix7bu0QF7gyduD0Mxra08sGToi0z6Td7A0ELPBFzk02relgjVZcnfKR4_q1QO4ycABHUFQn2wt5u77_H6BK3vL6DY3hk-tDqWdTJ6uKxLk6OjRheepLdDPgg7l8FarH4t0BBwygxO11Vnc7oB9cbQNMg5MoDx81TR2nMo97F9letMRdV8fbJttWiXEl72RhD2KghM3jCeKxwhoe5UCr9zLAvx")',
            }}
            data-alt="Professional headshot of Jane Doe, a virtual assistant."
          ></div>
          <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
            <div className="flex flex-col gap-2 text-left">
              <h1 className="text-primary text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl">
                Jane Doe
              </h1>
              <h2 className="text-text-light text-sm font-normal leading-normal @[480px]:text-base">
                Certified Executive Virtual Assistant. I streamline operations,
                manage deadlines, and provide reliable support to help you focus
                on what matters most.
              </h2>
            </div>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold">
              <span className="truncate">About Me</span>
            </button>
          </div>
        </div>
      </div>

      {/* SectionHeader: Services */}
      <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Your Focus, My Support
      </h2>
      {/* TextGrid: Services */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
        {[
          {
            icon: "mail",
            title: "Email & Calendar",
            desc: "Efficient inbox and schedule management.",
          },
          {
            icon: "flight",
            title: "Travel Coordination",
            desc: "Seamless travel and itinerary planning.",
          },
          {
            icon: "receipt_long",
            title: "Expense Reporting",
            desc: "Accurate invoicing and expense tracking.",
          },
          {
            icon: "group",
            title: "CRM & Database",
            desc: "Organized and up-to-date data entry.",
          },
          {
            icon: "share",
            title: "Social Media",
            desc: "Basic scheduling and content posting.",
          },
          {
            icon: "checklist",
            title: "Project Management",
            desc: "Support to keep your projects on track.",
          },
        ].map((service, idx) => (
          <div
            key={idx}
            className="flex flex-1 gap-3 rounded-lg border border-border-light bg-card-light p-4 flex-col"
          >
            <span className="material-symbols-outlined text-primary">
              {service.icon}
            </span>
            <div className="flex flex-col gap-1">
              <h3 className="text-text-light text-base font-bold leading-tight">
                {service.title}
              </h3>
              <p className="text-text-light/80 text-sm font-normal leading-normal">
                {service.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* SectionHeader: Testimonials */}
      <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
        Client Trust & Success
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
        {[
          {
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuB1TV12K0ZwQcn54w_CGKdBe7VXHIWIq8S-PM9iiaBAgkesjmfKt_pOL5f-OwY4MIFAXXqxlXnEqRUF-9cIC1cVy_GyilGZcaqiXqyxzsOBWSnz0Nf1St9Qs0s_ddxnV1NyaKNu6IW_U5Q32Sp25ABKPnlvz0dwXNIOpfi7LLL3kNWc6OdZeBDXEHvx33Ol5ltYCaUkjB8rpWlQQdU4rE6yvLE-JlbiynBQ4hAWtkUU_BKLuSkN2gexU5M_og5-gYs6-_GHBJdjJEu-",
            quote: "A true game-changer!",
            tasks: "Tasks: Calendar, Travel, Expenses",
          },
          {
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuAz2OYEMyiqybEQVzEq0DUsahJR2OEFarfOH2cPPGpnPwdXs-QJzv4ULnzqa-oHdX1L1jtxbRakQfTcNoAppfkkrDKjvtzto7B_bP7OkcvAUX5QRBwBX6qfwlV9V5kmQp-cGXWQm6mmXTMwvRfVsrPKYf9_FUJW6WyYahsfYz15TI2JEw-V2wrUh_WvyMphOCCY4BfSThu1WxAVl28DQQtwGaG8PZH10mnZ6FEZv4NcV4vTHnDIYo0o-rbgfakYXZWp8QWJK-aiXcL",
            quote: "Incredibly organized.",
            tasks: "Tasks: CRM, Invoicing, Reporting",
          },
          {
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuDyTTC19FXjr5syzy-rm860tkGmZMg-299-8HI0SYFxBh8qAZcxI2Ci81KIqua8X6fJa0hgxCUMXnAyKrpQNVrtgOLDAGK-HuI1tLoerOsHiYI7WIrXIsGTIChsSdh79pmzU7ARCHa8n1dNmuXjoby3W7-DOyr1YihZ66hdGGB7LswiXwcrSC_EXtrMT7SbmkVWSKMDTbcuC3A5n_mJw9PyXSeCeD58G6J1lbZpmd4ag7cSXM6PJ6SjnCng44sERZQu6HXuCKbyle_O",
            quote: "Freed up so much time.",
            tasks: "Tasks: Email, Social Media, Scheduling",
          },
          {
            image:
              "https://lh3.googleusercontent.com/aida-public/AB6AXuD-w7JenccrFMwD5IMhVvk970lludcjAKBhIK519ZkfqbSEyM5irVPo8Dd0zxCQIDBD4gxTspsrSvN1MX93z2-TBPp2w71JoqKjFM_yo-7n7NQsDpx6CSN0PkHkQ74H11Db5ktjw780ObfmUt_b53FylogIbCOa9P-5llue9gBI3zkbAg9Qxhk76rszELD4qC317OPngg7A-Aofp88vuCoaE1Lp7OfLJU-ZLRh0ywFncu3-p62scPcnaS3w1iE5SPi86agVu6VSd0Uq",
            quote: "Proactive and reliable.",
            tasks: "Tasks: Projects, Database, Coordination",
          },
        ].map((testimonial, idx) => (
          <div key={idx} className="flex flex-col gap-3 pb-3">
            <div
              className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
              style={{ backgroundImage: `url("${testimonial.image}")` }}
              data-alt="Testimonial image"
            ></div>
            <div>
              <p className="text-text-light text-base font-medium leading-normal">
                "{testimonial.quote}"
              </p>
              <p className="text-text-light/80 text-sm font-normal leading-normal">
                {testimonial.tasks}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 pb-8">
        <button className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-primary text-white text-sm font-bold">
          <span className="truncate">See Full Service Packages</span>
        </button>
      </div>

      {/* Section: Efficiency by Design (Case Study) */}
      <div className="px-4 py-5">
        <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Efficiency by Design
        </h2>
        <div className="flex flex-col gap-4 rounded-lg border border-border-light bg-card-light p-4">
          <div>
            <h3 className="font-bold text-text-light">The Challenge:</h3>
            <p className="text-sm text-text-light/80">
              A busy startup CEO was spending hours on administrative tasks,
              leading to scheduling conflicts and missed deadlines.
            </p>
          </div>
          <hr className="border-border-light" />
          <div>
            <h3 className="font-bold text-text-light">The Solution:</h3>
            <p className="text-sm text-text-light/80">
              I implemented a streamlined system for email filtering, calendar
              management, and task prioritization.
            </p>
          </div>
          <div className="mt-2 text-center bg-primary/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-primary">
              TIME SAVED PER MONTH
            </p>
            <p className="text-5xl font-black text-primary">20+ Hours</p>
          </div>
        </div>
      </div>

      {/* Section: Tools I Use */}
      <div className="py-5">
        <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">
          Tools I Use
        </h2>
        <div className="relative w-full overflow-x-auto pb-4">
          <div className="flex gap-3 px-4 whitespace-nowrap">
            {[
              "Asana & Trello",
              "Google Workspace",
              "Microsoft Office Suite",
              "Quickbooks",
              "Slack",
              "Zoom",
            ].map((tool, idx) => (
              <div
                key={idx}
                className="py-2 px-4 rounded-full border border-border-light bg-card-light"
              >
                <p className="text-sm font-medium">{tool}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section: What You Get */}
      <div className="px-4 py-5">
        <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          What You Get Working With Me
        </h2>
        <ul className="space-y-3">
          {[
            {
              icon: "lock",
              title: "Strict Confidentiality",
              desc: "Your business information is always secure and handled with the utmost discretion.",
            },
            {
              icon: "chat",
              title: "Proactive Communication",
              desc: "I provide regular updates and anticipate your needs to keep things running smoothly.",
            },
            {
              icon: "timer",
              title: "Guaranteed Response Times",
              desc: "You can count on timely responses to all your requests and inquiries.",
            },
            {
              icon: "event",
              title: "Flexible Scheduling",
              desc: "Packages are adaptable to fit your changing needs and business cycles.",
            },
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-0.5">
                {item.icon}
              </span>
              <div>
                <h3 className="font-bold leading-tight text-text-light">
                  {item.title}
                </h3>
                <p className="text-sm text-text-light/80">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Section: Social Links */}
      <div className="px-4 py-5">
        <h2 className="text-primary text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3">
          Connect With Me
        </h2>

        <div className="flex gap-3 flex-wrap">
          {[
            {
              icon: <Linkedin size={18} className="text-primary" />,
              label: "LinkedIn",
              url: "https://linkedin.com",
            },
            {
              icon: <Mail size={18} className="text-primary" />,
              label: "Email",
              url: "mailto:example@mail.com",
            },
            {
              icon: <Globe size={18} className="text-primary" />,
              label: "Website",
              url: "#",
            },
            {
              icon: <Calendar size={18} className="text-primary" />,
              label: "Book a Call",
              url: "https://calendly.com",
            },
            {
              icon: <Briefcase size={18} className="text-primary" />,
              label: "Upwork",
              url: "https://upwork.com",
            },

            // Socials you requested
            {
              icon: <Facebook size={18} className="text-primary" />,
              label: "Facebook",
              url: "https://facebook.com",
            },
            {
              icon: <Instagram size={18} className="text-primary" />,
              label: "Instagram",
              url: "https://instagram.com",
            },
            {
              icon: <Twitter size={18} className="text-primary" />,
              label: "X (Twitter)",
              url: "https://twitter.com",
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 px-4 rounded-full border border-border-light bg-card-light cursor-pointer"
            >
              {item.icon}
              <p className="text-sm font-medium">{item.label}</p>
            </a>
          ))}
        </div>
      </div>

      {/* Final CTA & Footer */}
      <div className="p-4 pt-8 pb-12">
        <button className="flex w-full min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-secondary text-white text-base font-bold">
          <span className="truncate">Start Your Delegation Today</span>
        </button>
        <p className="mt-6 text-center text-sm text-text-light/70">
          Your efficiency is my priority.
        </p>
      </div>
    </div>
  );
};

export default Portfolio7;

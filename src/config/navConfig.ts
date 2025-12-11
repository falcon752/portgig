// navConfig.ts

export const navConfig = {
  creator: {
    home: "/creative-homepage",

    desktop: [
      { label: "Home", href: "/creative-homepage" },
      { label: "Dashboard", href: "/creative-dashboard" },
      { label: "Job Hub", href: "/job-hub" },
      { label: "Creatives Hub", href: "/creatives-hub" },
      { label: "Profile Card", href: "/profile-card" },
      { label: "Notifications", href: "/creator-notifications" },
    ],

    mobile: [
      { label: "Home", href: "/creative-homepage" },
      { label: "Dashboard", href: "/creative-dashboard" },
      { label: "Creatives Hub", href: "/creatives-hub" },
      { label: "Job Hub", href: "/job-hub" },
      { label: "Profile Card", href: "/profile-card" },
      { label: "Notifications", href: "/creator-notifications" },
    ],

    avatarMenu: [
      { label: "Dashboard", href: "/creative-dashboard" },
      { label: "Edit Profile", href: "/profile-card" },
      { label: "Logout", href: "/logout" },
    ],
  },

  recruiter: {
    home: "/recruiter-homepage",

    desktop: [
      { label: "Home", href: "/recruiter-homepage" },
      { label: "Dashboard", href: "/recruiter-dashboard" },
      { label: "Job Hub", href: "/recruiter-job-hub" },
      { label: "Creatives Hub", href: "/recruiter-creatives-hub" },
      { label: "Notifications", href: "/recruiter-notifications" },
    ],

    mobile: [
      { label: "Home", href: "/recruiter-homepage" },
      { label: "Dashboard", href: "/recruiter-dashboard" },
      { label: "Job Hub", href: "/recruiter-job-hub" },
      { label: "Creatives Hub", href: "/recruiter-creatives-hub" },
      { label: "Notifications", href: "/recruiter-notifications" },
    ],

    avatarMenu: [
      { label: "Dashboard", href: "/recruiter-dashboard" },
      { label: "Edit Profile", href: "/recruiter-dashboard/recruiter-edit-profile" },
      { label: "Logout", href: "/logout" },
    ],
  },

  public: {
    desktop: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "Portfolio", href: "/portfolio/view" },
      { label: "Login", href: "/login" },
    ],
    mobile: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about-us" },
      { label: "Contact", href: "/contact" },
      { label: "Portfolio", href: "/portfolio/view" },
      { label: "Login", href: "/login" },
    ],
  }
};

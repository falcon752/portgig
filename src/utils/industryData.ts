export type Field =
  | "Creative and design"
  | "Writing"
  | "Tech"
  | "Digital Marketing"
  | "Cinematography";

export const industryOptions: Record<Field, string[]> = {
  "Creative and design": [
    "Graphic Designer", "UI/UX Designer", "Branding Designer", "Motion Designer", "Art Director",
    "Creative Director", "Illustration Artist", "3D Artist", "Packaging Designer", "Product Designer"
  ],
  "Writing": [
    "Copywriter", "Technical Writer", "UX Writer", "Content Writer", "Scriptwriter",
    "Ghostwriter", "Blogger", "Screenwriter", "Songwriter", "Editor"
  ],
  "Tech": [
    "Cloud Engineer", "DevOps Engineer", "Cybersecurity Specialist", "Ethical Hacker", "Data Scientist",
    "Data Analyst", "Machine Learning Engineer", "AI Developer", "Blockchain Developer", "Web 3",
    "Frontend Developer", "Backend Developer", "Full-Stack Developer"
  ],
  "Digital Marketing": [
    "Technical Writer", "IT Support Specialist", "Digital Marketer", "SEO Specialist", "SEM Specialist",
    "Content Marketer", "Social Media Manager", "Community Manager", "Content Creator", "Copywriter",
    "Scriptwriter", "Content Strategist", "Brand Strategist", "Email Marketing Specialist", "CRM Specialist",
    "Paid Ads Specialist"
  ],
  "Cinematography": [
    "Photographer", "Photo Editor", "Cinematographer", "Videographer", "Drone Operator",
    "Video Editor", "Colorist", "Content Creator", "Animator", "VFX Artist"
  ]
};

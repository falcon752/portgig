interface SkillBadgeProps {
    level: "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert";
  }
  
  export function SkillBadge({ level }: SkillBadgeProps) {
    const getVariant = () => {
      switch (level) {
        case "Expert":
          return "bg-[#587DBD] text-white";
        case "Beginner":
          return "bg-[#587DBD] text-white";
        case "Intermediate":
          return "bg-[#587DBD] text-white";
        case "Mid-level":
          return "bg-[#587DBD] text-white";
        case "Professional":
          return "bg-[#587DBD] text-white";
        default:
          return "bg-[#587DBD] text-white";
      }
    };
  
    return (
      <span
      className={`inline-flex items-center justify-center w-20 px-6 py-1  text-xl font-normal font-ramaraja ${getVariant()}`}
    >
      {level}
    </span>
    );
  }
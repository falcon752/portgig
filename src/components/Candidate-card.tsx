"use client"

import Image from "next/image"
import { SkillBadge } from "./Skill-badge"

interface CandidateCardProps {
  id: string
  name: string
  role: string
  location: string
  skillLevel: "Beginner" | "Intermediate" | "Mid-level" | "Professional" | "Expert"
  avatar: string
  isSelected?: boolean
  onSelect: (id: string) => void
}

export function CandidateCard({
  id,
  name,
  role,
  location,
  skillLevel,
  avatar,
  isSelected = false,
  onSelect,
}: CandidateCardProps) {
  return (
    <div
      className={`relative flex items-center justify-between p-4 md:p-5 lg:p-6 cursor-pointer ${
        isSelected ? "bg-[#ffffff]" : "bg-[#EDEDED] hover:bg-gray-100"
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="flex items-center space-x-3 md:space-x-4 lg:space-x-5 font-raleway">
        <Image
          src={avatar || "/assets/creative.svg"}
          alt={name}
          width={98}
          height={98}
          className="rounded-full object-cover w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24"
          onError={(e) => {
            e.currentTarget.src = "/assets/creative.svg"
          }}
        />
        <div>
          <h3 className="text-[10px] md:text-base lg:text-xl font-bold text-gray-900">{name}</h3>
          <p className="text-[10px] md:text-sm lg:text-base text-gray-600 font-light">
            {role}/{location}
          </p>
        </div>
      </div>

      {/* Position skill badge at top right edge - responsive positioning */}
      <div className="absolute -top-3 right-5 md:-top-4 md:right-6 lg:-top-5 lg:right-7">
        <SkillBadge level={skillLevel} />
      </div>
    </div>
  )
}
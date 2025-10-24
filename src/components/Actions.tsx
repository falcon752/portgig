"use client"

import { useState } from "react"
import { Buttons } from "./export_components"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { useAppSelector } from "../../src/redux/hooks"

const Actions = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAppSelector((state) => state.user)
  const [showPortfolioModal, setShowPortfolioModal] = useState(false)

  const hasPortfolio = Boolean(profile?.portfolio?.template_type)

  const links = [
    { label: "Edit Profile", path: "/creative-dashboard/edit-profile" },
    { label: "Edit CV/Resume", path: "/creative-dashboard/CVTemplateSelector" },
    {
      label: "Edit portfolio",
      path: hasPortfolio
        ? `/edit-template/${profile?.portfolio?.template_type?.toLowerCase()}`
        : null,
    },
    { label: "Change Password", path: "/creative-dashboard/change-password" },
  ]

  const buttonStyles = `
    border border-black
    max-md:px-2
    rounded-lg
    max-md:w-fit
    md:w-full
    max-md:text-[10px]
    sm:text-sm
    md:text-lg
    cursor-pointer
    transition-all duration-300
    hover:bg-primary hover:text-white
    hover:scale-105
  `

  const handleClick = (link: { label: string; path: string | null }) => {
    if (link.label === "Edit portfolio" && !hasPortfolio) {
      setShowPortfolioModal(true)
    } else if (link.path) {
      router.push(link.path)
    }
  }

  return (
    <>
      <aside className="flex max-md:justify-between max-md:items-center max-md:gap-5 md:flex-col gap-5 text-primary font-raleway">
        {links.map((link) => {
          const isActive =
            (link.label === "Edit CV/Resume" &&
              (pathname.startsWith("/creative-dashboard/edit-cv") ||
                pathname === "/creative-dashboard/CVTemplateSelector")) ||
            pathname === link.path

          return (
            <Buttons
              key={link.label}
              label={link.label}
              onClick={() => handleClick(link)}
              className={clsx(buttonStyles, isActive && "bg-primary! text-white")}
            />
          )
        })}
      </aside>

      {showPortfolioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <h3 className="text-lg font-semibold font-raleway text-gray-900 mb-2">
                No Portfolio Selected
              </h3>
              <p className="text-sm text-gray-600 mb-6 font-inter">
                You haven&apos;t selected a portfolio template yet. Go to the portfolio marketplace and pick one.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowPortfolioModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowPortfolioModal(false)
                    router.push("/portfolio")
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
                >
                  Go to Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Actions

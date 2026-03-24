"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import toast from 'react-hot-toast'
import apiClient from "@/service/apiClient"
import Cookies from "universal-cookie"
import { HexColorPicker } from "react-colorful"

interface CustomizationSettings {
    headingFont: string
    bodyFont: string
    primaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
}

interface ApiPortfolioFonts {
    heading_font: string
    body_font: string
    colors: {
        primary: string
        accent: string
        background: string
        text: string
    }
}

interface ProfileData {
    profile: {
        location?: { state: string; lga: string }
    }
    resume: {
        links?: {
            linkedin: string
            twitter: string
            instagram: string
            tiktok: string
        }
        education?: unknown[]
        skills?: unknown[]
        experience?: unknown[]
        other_skills?: unknown[]
        certifications?: unknown[]
    }
    portfolio: {
        fonts?: ApiPortfolioFonts
        job_titles?: unknown[]
        files?: unknown[]
        other_services?: unknown[]
        social?: {
            linkedin: string
            medium: string
            google_drive_link: string
            pinterest_or_behance_link: string
        }
        template_specific?: {
            types: unknown[]
            videography_skills: unknown[]
            video_editing_skills: unknown[]
            jobs_open_to: string
        }
    }
}

interface ColorOption {
    name: string
    value: string
}

export default function FontColorCustomization() {
    const router = useRouter()
    const cookies = new Cookies()
    const [settings, setSettings] = useState<CustomizationSettings>({
        headingFont: "",
        bodyFont: "",
        primaryColor: "",
        accentColor: "",
        backgroundColor: "",
        textColor: "",
    })

    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [colorPickerType, setColorPickerType] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fullProfileData, setFullProfileData] = useState<ProfileData | null>(null)
    const [showPreview, setShowPreview] = useState(false)

    const headingFonts: string[] = [
        "Inter",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Poppins",
        "Playfair Display",
        "Merriweather",
    ]

    const bodyFonts: string[] = [
        "Source Sans Pro",
        "Inter",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Poppins",
        "Playfair Display",
    ]

    const colors: ColorOption[] = [
        { name: "Blue", value: "#1e3a8a" },
        { name: "Green", value: "#16a34a" },
        { name: "Purple", value: "#9333ea" },
        { name: "Red", value: "#dc2626" },
        { name: "Orange", value: "#ea580c" },
        { name: "Teal", value: "#0d9488" },
        { name: "Gray", value: "#6b7280" },
        { name: "Black", value: "#000000" },
        { name: "White", value: "#ffffff" },
    ]

    const transformApiToComponent = (apiData: ApiPortfolioFonts): CustomizationSettings => {
        return {
            headingFont: apiData.heading_font || "",
            bodyFont: apiData.body_font || "",
            primaryColor: apiData.colors?.primary || "",
            accentColor: apiData.colors?.accent || "",
            backgroundColor: apiData.colors?.background || "",
            textColor: apiData.colors?.text || "",
        }
    }

    const transformComponentToApi = (componentData: CustomizationSettings): ApiPortfolioFonts => {
        return {
            heading_font: componentData.headingFont,
            body_font: componentData.bodyFont,
            colors: {
                primary: componentData.primaryColor,
                accent: componentData.accentColor,
                background: componentData.backgroundColor,
                text: componentData.textColor,
            }
        }
    }

    const fetchPortfolioData = async () => {
        try {
            setLoading(true)
            setError(null)

            const userId = cookies.get('userId')
            if (!userId) {
                throw new Error('User ID not found in cookies. Please log in again.')
            }

            const token = cookies.get('access_token')
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.')
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const response = await apiClient.get(`/creator/profile?creatorId=${userId}`, { headers })

            if (response.data?.data) {
                setFullProfileData(response.data.data)

                if (response.data.data.portfolio?.fonts) {
                    const transformedData = transformApiToComponent(response.data.data.portfolio.fonts)
                    setSettings(transformedData)
                }
            }
        } catch (err: any) {
            console.error('Error fetching portfolio data:', err)
            setError(err.response?.data?.message || err.message || 'Failed to load portfolio data')
        } finally {
            setLoading(false)
        }
    }

    const updatePortfolioFonts = async (newSettings: CustomizationSettings) => {
        try {
            setSaving(true)
            setError(null)

            if (!fullProfileData) {
                throw new Error('Profile data not loaded')
            }

            const userId = cookies.get('userId')
            if (!userId) {
                throw new Error('User ID not found in cookies. Please log in again.')
            }

            const token = cookies.get('access_token')
            if (!token) {
                throw new Error('Authentication token not found. Please log in again.')
            }

            const headers = {
                Authorization: `Bearer ${token}`
            }

            const apiData = transformComponentToApi(newSettings)

            const updatePayload = {
                profile: {
                    ...fullProfileData.profile,
                    location: fullProfileData.profile?.location || { state: "", lga: "" }
                },
                resume_info: {
                    ...fullProfileData.resume,
                    links: fullProfileData.resume?.links || {
                        linkedin: "",
                        twitter: "",
                        instagram: "",
                        tiktok: ""
                    },
                    education: fullProfileData.resume?.education || [],
                    skills: fullProfileData.resume?.skills || [],
                    experience: fullProfileData.resume?.experience || [],
                    other_skills: fullProfileData.resume?.other_skills || [],
                    certifications: fullProfileData.resume?.certifications || []
                },
                portfolio: {
                    ...fullProfileData.portfolio,
                    fonts: apiData,
                    job_titles: fullProfileData.portfolio?.job_titles || [],
                    files: fullProfileData.portfolio?.files || [],
                    other_services: fullProfileData.portfolio?.other_services || [],
                    social: fullProfileData.portfolio?.social || {
                        linkedin: "",
                        medium: "",
                        google_drive_link: "",
                        pinterest_or_behance_link: ""
                    },
                    template_specific: fullProfileData.portfolio?.template_specific || {
                        types: [],
                        videography_skills: [],
                        video_editing_skills: [],
                        jobs_open_to: ""
                    }
                }
            }

            console.log('Sending complete update payload with fonts modification')

            const response = await apiClient.put(`/creator/update-profile?section=PORTFOLIO&creatorId=${userId}`, updatePayload, { headers })

            const successMessage = response.data?.message?.toLowerCase()
            if (successMessage && (successMessage.includes('success') || successMessage.includes('updated'))) {
                console.log('Portfolio fonts updated successfully')
                toast.success('Portfolio fonts and colors updated successfully!')
                return true
            } else {
                throw new Error(response.data?.message || 'Failed to update portfolio')
            }
        } catch (err: any) {
            console.error('Error updating portfolio fonts:', err)

            const errorMessage = err.message || ''
            if (errorMessage.toLowerCase().includes('success') || errorMessage.toLowerCase().includes('updated')) {
                console.log('Update successful with message:', err.message)
                toast.success('Portfolio fonts and colors updated successfully!')
                return true
            }

            const errorMsg = err.response?.data?.message || err.message || 'Failed to save changes'
            setError(errorMsg)
            toast.error(errorMsg)
            return false
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        fetchPortfolioData()
    }, [])

    const handleDropdownToggle = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown)
        setColorPickerType(null) // Close picker if open
    }

    const handleFontSelect = (type: "headingFont" | "bodyFont", font: string) => {
        setSettings((prev) => ({ ...prev, [type]: font }))
        setOpenDropdown(null)
    }

    const handleColorSelect = (type: keyof CustomizationSettings, color: string) => {
        setSettings((prev) => ({ ...prev, [type]: color }))
        setOpenDropdown(null)
    }

    const handleCustomColor = (type: string) => {
        setColorPickerType(type)
        setOpenDropdown(null)
    }

    const handleColorPickerChange = (color: string) => {
        if (colorPickerType) {
            setSettings((prev) => ({ ...prev, [colorPickerType]: color }))
        }
    }

    const handleSave = async () => {
        // Basic validation: Check contrast (simple heuristic, e.g., text != background)
        if (settings.textColor && settings.backgroundColor && settings.textColor === settings.backgroundColor) {
            toast.error('Text and background colors cannot be the same for readability.')
            return
        }
        // More advanced contrast could be added with a library like 'tinycolor2'

        const success = await updatePortfolioFonts(settings)
        if (success) {
            router.back()
        }
    }

    const handleCancel = () => {
        router.back()
    }

    const handleReset = async () => {
        const empty: CustomizationSettings = {
            headingFont: "",
            bodyFont: "",
            primaryColor: "",
            accentColor: "",
            backgroundColor: "",
            textColor: "",
        }
        setSettings(empty)
        setColorPickerType(null)
        setOpenDropdown(null)
        const success = await updatePortfolioFonts(empty)
        if (success) {
            toast.success('Customizations cleared — templates will use their default styles.')
        }
    }

    const handlePreviewToggle = () => {
        setShowPreview(!showPreview)
    }

    const handleBackToPortfolio = () => {
        router.back()
    }

    // Memoized preview styles for performance
    const previewStyles = useMemo(() => ({
        fontFamily: settings.bodyFont || 'sans-serif',
        backgroundColor: settings.backgroundColor || '#ffffff',
        color: settings.textColor || '#000000',
    }), [settings])

    const headingStyle = useMemo(() => ({
        fontFamily: settings.headingFont || 'serif',
    }), [settings.headingFont])

    const buttonStyle = useMemo(() => ({
        backgroundColor: settings.primaryColor || '#007bff',
        color: settings.accentColor || '#ffffff',
    }), [settings.primaryColor, settings.accentColor])

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto bg-white font-inter">
                <div className="bg-[#0A1754] text-white px-6 py-4">
                    <h1 className="text-2xl font-semibold">Edit Profile</h1>
                </div>
                <div className="p-8 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A1754] mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading your portfolio settings...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto bg-white font-inter">
            <div className="bg-[#0A1754] text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Edit Profile</h1>
                <div className="flex gap-3">
                    <button
                        onClick={handleBackToPortfolio}
                        className="py-2 px-4 border border-white rounded text-sm hover:bg-white/10 transition cursor-pointer"
                        disabled={saving}
                    >
                        Back to Portfolio
                    </button>
                    <button
                        onClick={handleReset}
                        className="py-2 px-4 border border-red-300 text-red-200 rounded text-sm hover:bg-red-500/20 transition disabled:opacity-50 cursor-pointer"
                        disabled={saving}
                    >
                        Reset to Default
                    </button>
                    <button
                        onClick={handleSave}
                        className="py-2 px-6 bg-white text-[#0A1754] rounded text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
                    <p>{error}</p>
                    <button
                        onClick={fetchPortfolioData}
                        className="mt-2 text-sm underline hover:no-underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="p-8 space-y-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-[#0A1754]">
                        Customize Fonts & Colors <span className="text-gray-400 font-normal italic">[Optional]</span>
                    </h2>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#0A1754]">FONTS</h3>

                    <FontDropdown
                        label="Heading Font"
                        value={settings.headingFont}
                        options={headingFonts}
                        onSelect={(font) => handleFontSelect("headingFont", font)}
                        onToggle={() => handleDropdownToggle("headingFont")}
                        isOpen={openDropdown === "headingFont"}
                        disabled={saving}
                    />

                    <FontDropdown
                        label="Body Font"
                        value={settings.bodyFont}
                        options={bodyFonts}
                        onSelect={(font) => handleFontSelect("bodyFont", font)}
                        onToggle={() => handleDropdownToggle("bodyFont")}
                        isOpen={openDropdown === "bodyFont"}
                        disabled={saving}
                        note={`${settings.bodyFont ? `You're using ${settings.bodyFont}` : "Select a body font"} - we recommend Source Sans Pro as body text`}
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#0A1754]">COLORS</h3>

                    <ColorDropdown
                        label="Primary"
                        value={settings.primaryColor}
                        colors={colors}
                        onSelect={(color) => handleColorSelect("primaryColor", color)}
                        onCustom={() => handleCustomColor("primaryColor")}
                        onToggle={() => handleDropdownToggle("primaryColor")}
                        isOpen={openDropdown === "primaryColor"}
                        disabled={saving}
                    />

                    {colorPickerType === "primaryColor" && (
                        <div className="mt-2">
                            <HexColorPicker color={settings.primaryColor} onChange={handleColorPickerChange} />
                        </div>
                    )}

                    <ColorDropdown
                        label="Accent"
                        value={settings.accentColor}
                        colors={colors}
                        onSelect={(color) => handleColorSelect("accentColor", color)}
                        onCustom={() => handleCustomColor("accentColor")}
                        onToggle={() => handleDropdownToggle("accentColor")}
                        isOpen={openDropdown === "accentColor"}
                        disabled={saving}
                    />

                    {colorPickerType === "accentColor" && (
                        <div className="mt-2">
                            <HexColorPicker color={settings.accentColor} onChange={handleColorPickerChange} />
                        </div>
                    )}

                    <ColorDropdown
                        label="Background"
                        value={settings.backgroundColor}
                        colors={colors}
                        onSelect={(color) => handleColorSelect("backgroundColor", color)}
                        onCustom={() => handleCustomColor("backgroundColor")}
                        onToggle={() => handleDropdownToggle("backgroundColor")}
                        isOpen={openDropdown === "backgroundColor"}
                        disabled={saving}
                    />

                    {colorPickerType === "backgroundColor" && (
                        <div className="mt-2">
                            <HexColorPicker color={settings.backgroundColor} onChange={handleColorPickerChange} />
                        </div>
                    )}

                    <ColorDropdown
                        label="Text"
                        value={settings.textColor}
                        colors={colors}
                        onSelect={(color) => handleColorSelect("textColor", color)}
                        onCustom={() => handleCustomColor("textColor")}
                        onToggle={() => handleDropdownToggle("textColor")}
                        isOpen={openDropdown === "textColor"}
                        disabled={saving}
                    />

                    {colorPickerType === "textColor" && (
                        <div className="mt-2">
                            <HexColorPicker color={settings.textColor} onChange={handleColorPickerChange} />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handlePreviewToggle}
                        className="w-full py-3 bg-[#0A1754] text-white rounded font-medium hover:bg-[#0A1754]/90 transition disabled:opacity-50 cursor-pointer"
                        disabled={saving}
                    >
                        {showPreview ? 'Hide Preview' : 'Show Live Preview'}
                    </button>

                    {showPreview && (
                        <div className="border border-gray-300 rounded-lg p-6" style={previewStyles}>
                            <h2 className="text-2xl font-bold mb-4" style={headingStyle}>Sample Portfolio Heading</h2>
                            <p className="mb-4">This is a sample body text to preview your font and color choices. It should be readable and visually appealing.</p>
                            <button
                                className="px-4 py-2 rounded font-medium"
                                style={buttonStyle}
                            >
                                Sample Button
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-[#0A1754] px-6 py-4 flex justify-between items-center">
                <button
                    onClick={handleReset}
                    className="px-6 py-2 border border-red-300 text-red-200 rounded hover:bg-red-500/20 transition disabled:opacity-50 cursor-pointer"
                    disabled={saving}
                >
                    Reset to Default
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-2 border border-white text-white rounded hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 bg-white text-[#0A1754] rounded font-medium hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// Reusable FontDropdown component
interface FontDropdownProps {
    label: string
    value: string
    options: string[]
    onSelect: (font: string) => void
    onToggle: () => void
    isOpen: boolean
    disabled: boolean
    note?: string
}

function FontDropdown({
    label,
    value,
    options,
    onSelect,
    onToggle,
    isOpen,
    disabled,
    note,
}: FontDropdownProps) {
    return (
        <div className="space-y-3">
            <label className="block text-lg text-gray-700">{label}</label>
            <div className="relative">
                <button
                    onClick={onToggle}
                    className="w-full p-4 bg-gray-100 rounded-lg text-left flex justify-between items-center hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={disabled}
                >
                    <span className="text-gray-700">{value || "Select Font"}</span>
                    <ChevronDown size={20} className="text-gray-400" />
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                        {options.map((font) => (
                            <button
                                key={font}
                                onClick={() => onSelect(font)}
                                className="w-full p-3 text-left hover:bg-gray-50 transition first:rounded-t-lg last:rounded-b-lg"
                                style={{ fontFamily: font }}
                                disabled={disabled}
                            >
                                {font}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {note && <p className="text-gray-600 text-sm pl-4">{note}</p>}
        </div>
    )
}

// Reusable ColorDropdown component
interface ColorDropdownProps {
    label: string
    value: string
    colors: ColorOption[]
    onSelect: (color: string) => void
    onCustom: () => void
    onToggle: () => void
    isOpen: boolean
    disabled: boolean
}

function ColorDropdown({
    label,
    value,
    colors,
    onSelect,
    onCustom,
    onToggle,
    isOpen,
    disabled,
}: ColorDropdownProps) {
    const displayName = value
        ? colors.find((c) => c.value === value)?.name || value + ' (Custom)'
        : "Select Color"

    return (
        <div className="space-y-3">
            <label className="block text-lg text-gray-700">{label}</label>
            <div className="relative">
                <button
                    onClick={onToggle}
                    className="w-full p-4 bg-gray-100 rounded-lg text-left flex justify-between items-center hover:bg-gray-200 transition disabled:opacity-50"
                    disabled={disabled}
                >
                    <div className="flex items-center gap-3">
                        {value && (
                            <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: value }}
                            />
                        )}
                        <span className="text-gray-700">{displayName}</span>
                    </div>
                    <ChevronDown size={20} className="text-gray-400" />
                </button>
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
                        {colors.map((color) => (
                            <button
                                key={color.value}
                                onClick={() => onSelect(color.value)}
                                className="w-full p-3 text-left hover:bg-gray-50 transition flex items-center gap-3"
                                disabled={disabled}
                            >
                                <div
                                    className="w-6 h-6 rounded border border-gray-300"
                                    style={{ backgroundColor: color.value }}
                                />
                                {color.name}
                            </button>
                        ))}
                        <button
                            onClick={onCustom}
                            className="w-full p-3 text-left hover:bg-gray-50 transition last:rounded-b-lg"
                            disabled={disabled}
                        >
                            Custom Color...
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
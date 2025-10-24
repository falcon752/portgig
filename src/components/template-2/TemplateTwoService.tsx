import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization"

interface TemplateTwoServiceProps {
    services: string[]
    videographyTypes: string[]
    videographySkills: string[]
    videoEditingSkills: string[]
    portfolioData: any
}

const TemplateTwoService = ({
    services,
    videographyTypes,
    videographySkills,
    videoEditingSkills,
    portfolioData
}: TemplateTwoServiceProps) => {
    const { colorUtils, customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
    return (
        <section>
            <div className="h-20 flex items-center pl-10">
                <h2 className="font-bold text-xl lg:text-3xl text-white" style={getHeadingStyle()}>
                    MY<span className="text-yellowGold"> SERVICES</span>
                </h2>
            </div>

            {/* Section for Other Services */}
            {services && services.length > 0 && (
                <div className="bg-yellowGold pl-5 py-10 md:pl-10 flex flex-col gap-5 text-white" style={{ boxShadow: `0 4px 8px ${colorUtils.darken((customStyles as Record<string, string>)['--accent-color'] || '#FFBA00', 0.5)}` }}>
                    <h2 className="font-bold text-2xl">VIDEOGRAPHY SKILLS:</h2>
                    <ol className="space-y-5 list-disc list-inside">
                        {services.map((service, index) => (
                            <li key={index} className="font-bold lg:text-xl uppercase">
                                {service}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Section for Videography Types */}
            {videographyTypes && videographyTypes.length > 0 && (
                <div className="bg-brownLight pl-5 py-10 md:pl-10 flex flex-col gap-5 text-white" style={{ backgroundColor: `${colorUtils.darken((customStyles as Record<string, string>)['--bg-color'] || '#FFBA00', 0.5)}` }}>
                    <h2 className="font-bold text-2xl">Videography Types:</h2>
                    <ol className="grid grid-cols-2 gap-5 list-disc list-inside">
                        {videographyTypes.map((type, index) => (
                            <li key={index} className="font-bold lg:text-xl uppercase text-white" style={getBodyStyle()}>
                                {type}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Section for Videography Skills */}
            {videographySkills && videographySkills.length > 0 && (
                <div className="bg-yellowGold pl-5 py-10 md:pl-10 flex flex-col gap-5 text-white" style={{ backgroundColor: `${colorUtils.darken((customStyles as Record<string, string>)['--accent-color'] || '#FFBA00', 0.5)}` }}>
                    <h2 className="font-bold text-2xl">Videography Skills:</h2>
                    <ol className="space-y-5 list-disc list-inside">
                        {videographySkills.map((skill, index) => (
                            <li key={index} className="font-bold lg:text-xl uppercase">
                                {skill}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {/* Section for Video Editing Skills */}
            {videoEditingSkills && videoEditingSkills.length > 0 && (
                <div className="bg-brownLight pl-5 py-10 md:pl-10 flex flex-col gap-5 text-white" style={{ backgroundColor: `${colorUtils.darken((customStyles as Record<string, string>)['--bg-color'] || '#FFBA00', 0.5)}` }}>
                    <h2 className="font-bold text-2xl">Video Editing Skills:</h2>
                    <ol className="space-y-5 list-disc list-inside">
                        {videoEditingSkills.map((skill, index) => (
                            <li key={index} className="font-bold lg:text-xl uppercase text-white" style={getBodyStyle()}>
                                {skill}
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </section>
    )
}

export default TemplateTwoService

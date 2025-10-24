import { usePortfolioCustomizations } from "@/src/utils/portfolioCustomization";

interface TemplateFiveServicesProps {
  otherServices: string[]
  portfolioData?: any
}

export default function Services({ otherServices, portfolioData }: TemplateFiveServicesProps) {
  const { customStyles, getHeadingStyle, getBodyStyle } = usePortfolioCustomizations(portfolioData);
  
  // Create dynamic border colors based on primary and accent colors
  const getBorderColor = (index: number) => {
    const colors = [
      (customStyles as Record<string, string>)['--accent-color'], 
      (customStyles as Record<string, string>)['--primary-color'], 
      (customStyles as Record<string, string>)['--text-color']
    ];
    return colors[index % colors.length];
  };

  return (
    <div 
      className="px-4 md:px-10 py-10"
      style={{ ...customStyles, backgroundColor: (customStyles as Record<string, string>)['--bg-color'] }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10 max-w-2xl mx-auto">
        <h2 
          className="text-2xl md:text-3xl font-bold lg:mt-60"
          style={getHeadingStyle()}
        >
          Services I Offer
        </h2>
        {otherServices && otherServices.length > 0 ? (
          otherServices.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-md border-6 font-bold text:xl lg:text-2xl text-center py-20 transition-transform hover:scale-105"
              style={{
                backgroundColor: 'white',
                color: 'black',
                borderColor: getBorderColor(index),
                fontFamily: (customStyles as Record<string, string>)['--body-font']
              }}
            >
              {service}
            </div>
          ))
        ) : (
          <div 
            className="sm:col-span-2 text-center text-lg"
            style={getBodyStyle({ opacity: 0.7 })}
          >
            No services to display.
          </div>
              )}
      </div>
    </div>
  )
}
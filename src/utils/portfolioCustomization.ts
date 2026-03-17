"use client";
// import { useMemo } from 'react';
// import { ApiPortfolioData } from '@/types/portfolio'; 

// export interface PortfolioCustomizations {
//   headingFont: string;
//   bodyFont: string;
//   primaryColor: string;
//   accentColor: string;
//   backgroundColor: string;
//   textColor: string;
// }

// export interface ApiPortfolioFonts {
//   heading_font: string;
//   body_font: string;
//   colors: {
//     primary: string;
//     accent: string;
//     background: string;
//     text: string;
//   };
// }

// // Default customizations that work well for all templates
// const DEFAULT_CUSTOMIZATIONS: PortfolioCustomizations = {
//   headingFont: 'Inter',
//   bodyFont: 'Source Sans Pro',
//   primaryColor: '#1e3a8a',
//   accentColor: '#16a34a',
//   backgroundColor: '#ffffff',
//   textColor: '#000000',
// };

// // Template-specific default customizations
// const TEMPLATE_DEFAULTS: Record<string, Partial<PortfolioCustomizations>> = {
//   VIDEOGRAPHER: {
//     primaryColor: '#dc2626', // Red
//     accentColor: '#ea580c', // Orange
//   },
//   PHOTOGRAPHER: {
//     primaryColor: '#6b7280', // Gray
//     accentColor: '#9333ea', // Purple
//   },
//   DEVELOPER: {
//     primaryColor: '#1e3a8a', // Blue
//     accentColor: '#0d9488', // Teal
//   },
//   DESIGNER: {
//     primaryColor: '#9333ea', // Purple
//     accentColor: '#dc2626', // Red
//   },
//   SOCIAL_MEDIA_MANAGER: {
//     primaryColor: '#16a34a', // Green
//     accentColor: '#ea580c', // Orange
//   },
// };

// /**
//  * Transform API font data to component-friendly format
//  */
// export const transformApiToComponent = (apiData: ApiPortfolioFonts): PortfolioCustomizations => {
//   return {
//     headingFont: apiData.heading_font || DEFAULT_CUSTOMIZATIONS.headingFont,
//     bodyFont: apiData.body_font || DEFAULT_CUSTOMIZATIONS.bodyFont,
//     primaryColor: apiData.colors?.primary || DEFAULT_CUSTOMIZATIONS.primaryColor,
//     accentColor: apiData.colors?.accent || DEFAULT_CUSTOMIZATIONS.accentColor,
//     backgroundColor: apiData.colors?.background || DEFAULT_CUSTOMIZATIONS.backgroundColor,
//     textColor: apiData.colors?.text || DEFAULT_CUSTOMIZATIONS.textColor,
//   };
// };

// /**
//  * Transform component data to API format
//  */
// export const transformComponentToApi = (componentData: PortfolioCustomizations): ApiPortfolioFonts => {
//   return {
//     heading_font: componentData.headingFont,
//     body_font: componentData.bodyFont,
//     colors: {
//       primary: componentData.primaryColor,
//       accent: componentData.accentColor,
//       background: componentData.backgroundColor,
//       text: componentData.textColor,
//     },
//   };
// };

// /**
//  * Get customizations for the current portfolio template
//  * Priority: template-specific > general > template defaults > global defaults
//  */
// export const getPortfolioCustomizations = (portfolioData: ApiPortfolioData): PortfolioCustomizations => {
//   const templateType = portfolioData?.template_type?.toUpperCase();

//   // Start with global defaults
//   let customizations = { ...DEFAULT_CUSTOMIZATIONS };

//   // Apply template-specific defaults if available
//   if (templateType && TEMPLATE_DEFAULTS[templateType]) {
//     customizations = {
//       ...customizations,
//       ...TEMPLATE_DEFAULTS[templateType],
//     };
//   }

//   // Try to get template-specific customizations first
//   if (portfolioData?.template_fonts && templateType && portfolioData?.template_fonts[templateType]) {
//     const templateFonts = portfolioData.template_fonts[templateType];
//     const templateCustomizations = transformApiToComponent(templateFonts);
//     return {
//       ...customizations,
//       ...templateCustomizations,
//     };
//   }

//   // Fall back to general fonts if available
//   if (portfolioData?.fonts) {
//     const generalCustomizations = transformApiToComponent(portfolioData.fonts);
//     return {
//       ...customizations,
//       ...generalCustomizations,
//     };
//   }

//   // Return defaults with template-specific enhancements
//   return customizations;
// };

// /**
//  * Generate CSS custom properties from customizations
//  */
// export const generateCustomCSS = (customizations: PortfolioCustomizations): React.CSSProperties => {
//   return {
//     '--heading-font': customizations.headingFont,
//     '--body-font': customizations.bodyFont,
//     '--primary-color': customizations.primaryColor,
//     '--accent-color': customizations.accentColor,
//     '--bg-color': customizations.backgroundColor,
//     '--text-color': customizations.textColor,
//   } as React.CSSProperties;
// };

// /**
//  * Check if a portfolio has custom fonts/colors set
//  */
// export const hasCustomizations = (portfolioData: ApiPortfolioData): boolean => {
//   const templateType = portfolioData?.template_type?.toUpperCase();

//   // Check for template-specific customizations
//   if (portfolioData?.template_fonts && templateType && portfolioData?.template_fonts[templateType]) {
//     return true;
//   }

//   // Check for general customizations
//   if (portfolioData?.fonts) {
//     return true;
//   }

//   return false;
// };

// /**
//  * Get available font options
//  */
// export const getFontOptions = () => {
//   return {
//     headingFonts: [
//       'Inter',
//       'Roboto',
//       'Open Sans',
//       'Lato',
//       'Montserrat',
//       'Poppins',
//       'Playfair Display',
//       'Merriweather',
//       'Oswald',
//       'Raleway',
//     ],
//     bodyFonts: [
//       'Source Sans Pro',
//       'Inter',
//       'Roboto',
//       'Open Sans',
//       'Lato',
//       'Montserrat',
//       'Poppins',
//       'Playfair Display',
//       'PT Sans',
//       'Nunito',
//     ],
//   };
// };

// /**
//  * Get available color options
//  */
// export const getColorOptions = () => {
//   return [
//     { name: 'Blue', value: '#1e3a8a' },
//     { name: 'Green', value: '#16a34a' },
//     { name: 'Purple', value: '#9333ea' },
//     { name: 'Red', value: '#dc2626' },
//     { name: 'Orange', value: '#ea580c' },
//     { name: 'Teal', value: '#0d9488' },
//     { name: 'Indigo', value: '#4f46e5' },
//     { name: 'Pink', value: '#ec4899' },
//     { name: 'Yellow', value: '#eab308' },
//     { name: 'Gray', value: '#6b7280' },
//     { name: 'Black', value: '#000000' },
//     { name: 'White', value: '#ffffff' },
//     { name: 'Dark Blue', value: '#1e40af' },
//     { name: 'Dark Green', value: '#15803d' },
//     { name: 'Dark Purple', value: '#7c3aed' },
//   ];
// };

// /**
//  * Custom hook for easy consumption in portfolio components
//  */
// export const usePortfolioCustomizations = (portfolioData: ApiPortfolioData) => {
//   const customizations = useMemo(() => getPortfolioCustomizations(portfolioData), [portfolioData]);
//   const customStyles = useMemo(() => generateCustomCSS(customizations), [customizations]);

//   // Helper functions for common styling patterns
//   const getHeadingStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     fontFamily: 'var(--heading-font)',
//     color: 'var(--primary-color)',
//     ...additionalStyles,
//   });

//   const getBodyStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     fontFamily: 'var(--body-font)',
//     color: 'var(--text-color)',
//     ...additionalStyles,
//   });

//   const getAccentStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     color: 'var(--accent-color)',
//     ...additionalStyles,
//   });

//   const getButtonStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     backgroundColor: 'var(--primary-color)',
//     color: 'var(--bg-color)',
//     fontFamily: 'var(--body-font)',
//     border: 'none',
//     cursor: 'pointer',
//     transition: 'all 0.2s ease',
//     ...additionalStyles,
//   });

//   const getCardStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     backgroundColor: 'var(--bg-color)',
//     color: 'var(--text-color)',
//     fontFamily: 'var(--body-font)',
//     border: `1px solid ${customizations.primaryColor}20`, // 20% opacity
//     ...additionalStyles,
//   });

//   const getLinkStyle = (additionalStyles: React.CSSProperties = {}): React.CSSProperties => ({
//     color: 'var(--accent-color)',
//     fontFamily: 'var(--body-font)',
//     textDecoration: 'none',
//     transition: 'all 0.2s ease',
//     ...additionalStyles,
//   });

//   return {
//     customizations,
//     customStyles,
//     hasCustomizations: hasCustomizations(portfolioData),
//     templateType: portfolioData?.template_type,
//     // Styling helpers
//     getHeadingStyle,
//     getBodyStyle,
//     getAccentStyle,
//     getButtonStyle,
//     getCardStyle,
//     getLinkStyle,
//     colorUtils,
//     // CSS variables for direct use
//     cssVars: {
//       headingFont: 'var(--heading-font)',
//       bodyFont: 'var(--body-font)',
//       primaryColor: 'var(--primary-color)',
//       accentColor: 'var(--accent-color)',
//       backgroundColor: 'var(--bg-color)',
//       textColor: 'var(--text-color)',
//     },
//   };
// };

// /**
//  * Utility to merge template-specific data with general portfolio data
//  */
// export const getTemplateSpecificData = (portfolioData: ApiPortfolioData) => {
//   const templateType = portfolioData?.template_type?.toLowerCase();
//   const templateSpecific = portfolioData?.template_specific?.[templateType as keyof typeof portfolioData.template_specific];

//   return {
//     ...portfolioData,
//     templateData: templateSpecific || {},
//   };
// };

// /**
//  * Color utility functions
//  */
// export const colorUtils = {
//   // Convert hex to rgba
//   hexToRgba: (hex: string, alpha: number = 1): string => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);
//     return `rgba(${r}, ${g}, ${b}, ${alpha})`;
//   },

//   // Get a lighter version of a color
//   lighten: (hex: string, amount: number = 0.1): string => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);

//     const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
//     const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
//     const newB = Math.min(255, Math.floor(b + (255 - b) * amount));

//     return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
//   },

//   // Get a darker version of a color
//   darken: (hex: string, amount: number = 0.1): string => {
//     const r = parseInt(hex.slice(1, 3), 16);
//     const g = parseInt(hex.slice(3, 5), 16);
//     const b = parseInt(hex.slice(5, 7), 16);

//     const newR = Math.max(0, Math.floor(r * (1 - amount)));
//     const newG = Math.max(0, Math.floor(g * (1 - amount)));
//     const newB = Math.max(0, Math.floor(b * (1 - amount)));

//     return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
//   },
// };

// export default {
//   getPortfolioCustomizations,
//   generateCustomCSS,
//   usePortfolioCustomizations,
//   transformApiToComponent,
//   transformComponentToApi,
//   hasCustomizations,
//   getTemplateSpecificData,
//   getFontOptions,
//   getColorOptions,
//   colorUtils,
//   DEFAULT_CUSTOMIZATIONS,
//   TEMPLATE_DEFAULTS,
// };



import { useMemo, useEffect } from 'react';
import { CSSProperties } from 'react';
import { ApiPortfolioData, EMPTY_PORTFOLIO, CustomCSSProperties } from '@/types/portfolio';

export interface PortfolioCustomizations {
  headingFont: string;
  bodyFont: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

// Default customizations that work well for all templates
const DEFAULT_CUSTOMIZATIONS: PortfolioCustomizations = {
  headingFont: 'Inter',
  bodyFont: 'Source Sans Pro',
  primaryColor: '#1e3a8a',
  accentColor: '#16a34a',
  backgroundColor: '#ffffff',
  textColor: '#000000',
};

// Template-specific default customizations
const TEMPLATE_DEFAULTS: Record<string, Partial<PortfolioCustomizations>> = {
  // Dark-background templates → white body text so it's readable on black sections
  VIDEOGRAPHER: {
    primaryColor: '#dc2626', // Red
    accentColor: '#ea580c',  // Orange
    textColor: '#ffffff',    // White text on dark bg
  },
  PHOTOGRAPHER: {
    primaryColor: '#FCC92F', // Gold (matches template's accent)
    accentColor: '#9333ea',  // Purple
    textColor: '#ffffff',    // White text on dark bg
  },
  DEVELOPER: {
    primaryColor: '#60a5fa', // Light blue (was dark navy #1e3a8a — invisible on black)
    accentColor: '#0d9488',  // Teal
    textColor: '#ffffff',    // White text on dark bg
  },
  DESIGNER: {
    primaryColor: '#9333ea', // Purple
    accentColor: '#dc2626',  // Red
    textColor: '#ffffff',    // White text on dark bg
  },
  // Light-background templates → dark text (global default #000000 applies)
  SOCIAL_MEDIA_MANAGER: {
    primaryColor: '#16a34a', // Green
    accentColor: '#ea580c',  // Orange
    // textColor intentionally omitted → falls back to global default #000000
  },
  WRITER: {
    primaryColor: '#1e3a8a', // Dark blue — readable on cream bg
    accentColor: '#E77C29',  // Orange (matches template border accent)
    // textColor intentionally omitted → falls back to global default #000000
  },
};


export const transformApiToComponent = (apiData: ApiPortfolioFonts): PortfolioCustomizations => {
  return {
    headingFont: apiData.heading_font || DEFAULT_CUSTOMIZATIONS.headingFont,
    bodyFont: apiData.body_font || DEFAULT_CUSTOMIZATIONS.bodyFont,
    primaryColor: apiData.colors?.primary || DEFAULT_CUSTOMIZATIONS.primaryColor,
    accentColor: apiData.colors?.accent || DEFAULT_CUSTOMIZATIONS.accentColor,
    backgroundColor: apiData.colors?.background || DEFAULT_CUSTOMIZATIONS.backgroundColor,
    textColor: apiData.colors?.text || DEFAULT_CUSTOMIZATIONS.textColor,
  };
};


export const transformComponentToApi = (componentData: PortfolioCustomizations): ApiPortfolioFonts => {
  return {
    heading_font: componentData.headingFont,
    body_font: componentData.bodyFont,
    colors: {
      primary: componentData.primaryColor,
      accent: componentData.accentColor,
      background: componentData.backgroundColor,
      text: componentData.textColor,
    },
  };
};


export const getPortfolioCustomizations = (portfolioData: ApiPortfolioData = EMPTY_PORTFOLIO): PortfolioCustomizations => {
  const templateType = portfolioData?.template_type?.toUpperCase() || '';

  // Start with global defaults
  let customizations = { ...DEFAULT_CUSTOMIZATIONS };

  // Apply template-specific defaults if available
  if (templateType && TEMPLATE_DEFAULTS[templateType]) {
    customizations = {
      ...customizations,
      ...TEMPLATE_DEFAULTS[templateType],
    };
  }

  // Try to get template-specific customizations first
  if (portfolioData?.template_fonts && templateType && portfolioData.template_fonts[templateType]) {
    const templateFonts = portfolioData.template_fonts[templateType];
    const templateCustomizations = transformApiToComponent(templateFonts);
    return {
      ...customizations,
      ...templateCustomizations,
    };
  }

  if (portfolioData?.fonts) {
    const generalCustomizations = transformApiToComponent(portfolioData.fonts);
    return {
      ...customizations,
      ...generalCustomizations,
    };
  }

  return customizations;
};

/**
 * Generate CSS custom properties from customizations
 */
export const generateCustomCSS = (customizations: PortfolioCustomizations): CustomCSSProperties => {
  return {
    '--heading-font': customizations.headingFont,
    '--body-font': customizations.bodyFont,
    '--primary-color': customizations.primaryColor,
    '--accent-color': customizations.accentColor,
    '--bg-color': customizations.backgroundColor,
    '--text-color': customizations.textColor,
    // NOTE: do NOT set backgroundColor/color here — that would override every
    // template section's intentional background. Individual components opt-in.
  };
};


export const hasCustomizations = (portfolioData: ApiPortfolioData = EMPTY_PORTFOLIO): boolean => {
  const templateType = portfolioData?.template_type?.toUpperCase() || '';

  if (portfolioData?.template_fonts && templateType && portfolioData.template_fonts[templateType]) {
    return true;
  }

  if (portfolioData?.fonts) {
    return true;
  }

  return false;
};


export const getFontOptions = () => {
  return {
    headingFonts: [
      'Inter',
      'Roboto',
      'Open Sans',
      'Lato',
      'Montserrat',
      'Poppins',
      'Playfair Display',
      'Merriweather',
      'Oswald',
      'Raleway',
    ],
    bodyFonts: [
      'Source Sans Pro',
      'Inter',
      'Roboto',
      'Open Sans',
      'Lato',
      'Montserrat',
      'Poppins',
      'Playfair Display',
      'PT Sans',
      'Nunito',
    ],
  };
};


export const getColorOptions = () => {
  return [
    { name: 'Blue', value: '#1e3a8a' },
    { name: 'Green', value: '#16a34a' },
    { name: 'Purple', value: '#9333ea' },
    { name: 'Red', value: '#dc2626' },
    { name: 'Orange', value: '#ea580c' },
    { name: 'Teal', value: '#0d9488' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#ffffff' },
    { name: 'Dark Blue', value: '#1e40af' },
    { name: 'Dark Green', value: '#15803d' },
    { name: 'Dark Purple', value: '#7c3aed' },
  ];
};





export const usePortfolioCustomizations = (portfolioData: ApiPortfolioData = EMPTY_PORTFOLIO) => {
  const customizations = useMemo(() => getPortfolioCustomizations(portfolioData), [portfolioData]);
  const customStyles = useMemo(() => generateCustomCSS(customizations), [customizations]);

  // Resolves to the explicitly-saved background color, or null if none was saved.
  // Use this to optionally override a template's hardcoded background.
  const customBackgroundColor: string | null = useMemo(() => {
    const templateType = portfolioData?.template_type?.toUpperCase() || '';
    if (portfolioData?.template_fonts && templateType && portfolioData.template_fonts[templateType]) {
      const bg = portfolioData.template_fonts[templateType]?.colors?.background;
      if (bg && bg.trim() !== '') return bg;
    }
    const bg = portfolioData?.fonts?.colors?.background;
    if (bg && bg.trim() !== '') return bg;
    return null;
  }, [portfolioData]);

  // Resolves to the explicitly-saved primary color, or null if none was saved.
  // Use this on spans inside headings so they follow the user-chosen heading color.
  const customPrimaryColor: string | null = useMemo(() => {
    const templateType = portfolioData?.template_type?.toUpperCase() || '';
    if (portfolioData?.template_fonts && templateType && portfolioData.template_fonts[templateType]) {
      const primary = portfolioData.template_fonts[templateType]?.colors?.primary;
      if (primary && primary.trim() !== '') return primary;
    }
    const primary = portfolioData?.fonts?.colors?.primary;
    if (primary && primary.trim() !== '') return primary;
    return null;
  }, [portfolioData]);

  // Dynamically inject Google Fonts <link> for whichever fonts the user selected
  useEffect(() => {
    const fontsToLoad = [...new Set([customizations.headingFont, customizations.bodyFont])]
      .filter((f) => f && /^[A-Za-z0-9 \-]+$/.test(f));

    if (fontsToLoad.length === 0) return;

    const fontQuery = fontsToLoad
      .map((f) => `family=${encodeURIComponent(f)}:wght@400;500;600;700`)
      .join('&');
    const href = `https://fonts.googleapis.com/css2?${fontQuery}&display=swap`;

    const LINK_ID = 'portfolio-custom-fonts';
    let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = href;
  }, [customizations.headingFont, customizations.bodyFont]);

  const getHeadingStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    fontFamily: customizations.headingFont,
    color: customizations.primaryColor,
    ...additionalStyles,
  });

  const getBodyStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    fontFamily: customizations.bodyFont,
    color: customizations.textColor,
    ...additionalStyles,
  });

  const getAccentStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    color: customizations.accentColor,
    ...additionalStyles,
  });

  const getButtonStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    backgroundColor: customizations.primaryColor,
    color: customizations.backgroundColor,
    fontFamily: customizations.bodyFont,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ...additionalStyles,
  });

  const getCardStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    backgroundColor: customizations.backgroundColor,
    color: customizations.textColor,
    fontFamily: 'var(--body-font)',
    border: `1px solid ${customizations.primaryColor}20`, // 20% opacity
    ...additionalStyles,
  });

  const getLinkStyle = (additionalStyles: CSSProperties = {}): CSSProperties => ({
    color: customizations.accentColor,
    fontFamily: customizations.bodyFont,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    ...additionalStyles,
  });

  return {
    customizations,
    customStyles,
    customBackgroundColor,
    customPrimaryColor,
    hasCustomizations: hasCustomizations(portfolioData),
    templateType: portfolioData?.template_type,
    // Styling helpers
    getHeadingStyle,
    getBodyStyle,
    getAccentStyle,
    getButtonStyle,
    getCardStyle,
    getLinkStyle,
    colorUtils: {
      hexToRgba: colorUtils.hexToRgba,
      lighten: colorUtils.lighten,
      darken: colorUtils.darken,
    },
    // CSS variables for direct use
    cssVars: {
      headingFont: 'var(--heading-font)',
      bodyFont: 'var(--body-font)',
      primaryColor: 'var(--primary-color)',
      accentColor: 'var(--accent-color)',
      backgroundColor: 'var(--bg-color)',
      textColor: 'var(--text-color)',
    },
  };
};


export const getTemplateSpecificData = (portfolioData: ApiPortfolioData = EMPTY_PORTFOLIO) => {
  const templateType = portfolioData?.template_type?.toLowerCase();
  const templateSpecific = portfolioData?.template_specific?.[templateType as keyof typeof portfolioData.template_specific];

  return {
    ...portfolioData,
    templateData: templateSpecific || {},
  };
};


export const colorUtils = {
  // Convert hex to rgba
  hexToRgba: (hex: string, alpha: number = 1): string => {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  // Get a lighter version of a color
  lighten: (hex: string, amount: number = 0.1): string => {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * amount));
    const newG = Math.min(255, Math.floor(g + (255 - g) * amount));
    const newB = Math.min(255, Math.floor(b + (255 - b) * amount));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  },

  // Get a darker version of a color
  darken: (hex: string, amount: number = 0.1): string => {
    const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  },
};

// Define template-specific interfaces
export interface WriterTemplateSpecific {
  case_study: string;
}

export interface VideographerTemplateSpecific {
  video_links: string[];
}

export interface DeveloperTemplateSpecific {
  github_repos: string[];
  tech_stack: string[];
}

export interface PhotographerTemplateSpecific {
  portfolio_images: string[];
  camera_equipment: string[];
}

export interface DesignerTemplateSpecific {
  design_tools: string[];
  portfolio_link: string;
}

export interface SocialMediaManagerTemplateSpecific {
  social_platforms: string[];
  analytics_tools: string[];
}

export interface ApiPortfolioFonts {
  heading_font: string;
  body_font: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
}
"use client"

import type React from "react"
import type { FormData } from "@/types/resume"
import Image from "next/image"

interface MinimalisteTemplateProps {
  formData: FormData
}

export const MinimalistTemplate: React.FC<MinimalisteTemplateProps> = ({ formData }) => {
  return (
    <div className="minimaliste-template">
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .minimaliste-template { 
          font-family: 'Inter', 'Arial', sans-serif; 
          background: #f8f9fa;
          color: #1f2937;
          line-height: 1.6;
          padding: 60px 50px;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          position: relative;
        }
        
        .section {
          margin-bottom: 50px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 25px;
          text-transform: uppercase;
          border-bottom: 2px solid #1f2937;
          padding-bottom: 5px;
          display: inline-block;
          letter-spacing: 1px;
        }
        
        .why-work-list {
          list-style: none;
          padding: 0;
        }
        
        .why-work-item {
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          padding-left: 0;
        }
        
        .skills-list {
          list-style: none;
          padding: 0;
        }
        
        .skill-item {
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
          padding-left: 20px;
          position: relative;
        }
        
        .certifications-list {
          list-style: none;
          padding: 0;
        }
        
        .certification-item {
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
          padding-left: 20px;
          position: relative;
        }
        
        .logo-section {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #1e3a8a;
          color: white;
          padding: 15px 25px;
          border-top-left-radius: 8px;
        }
        
        .logo-text {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .logo-img {
          width: 70px;
          height: auto;
        }
        
        @media print {
          .minimalist-template { 
            padding: 40px;
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .logo-section {
            background: #1e3a8a !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* Why Work With Me Section */}
      <div className="section">
        <div className="section-title">Why Work With Me?</div>
        <ul className="why-work-list">
          <li className="why-work-item">
            {formData.experience?.[0]?.contribution ||
              "Designed compelling social media graphics, banners, and ads to increase brand visibility."}
          </li>
          <li className="why-work-item">
            {formData.experience?.[1]?.contribution ||
              "Created engaging product visuals and promotional materials for online sales."}
          </li>
          <li className="why-work-item">Collaborated with marketing teams to develop branding strategies.</li>
          <li className="why-work-item">
            Developed brand identity concepts, including logos, typography, and brand guidelines.
          </li>
          <li className="why-work-item">Designed marketing assets for digital and print campaigns.</li>
        </ul>
      </div>

      {/* Soft Skills Section */}
      <div className="section">
        <div className="section-title">Soft Skill</div>
        <ul className="skills-list">
          {formData.skills && formData.skills.length > 0 ? (
            formData.skills.map((skill, index) => (
              <li key={index} className="skill-item">
                {skill.value}
              </li>
            ))
          ) : (
            <>
              <li className="skill-item">Photoshop</li>
              <li className="skill-item">CorelDraw</li>
              <li className="skill-item">Figma</li>
              <li className="skill-item">Indesign</li>
            </>
          )}
        </ul>
      </div>

      {/* Certifications Section */}
      <div className="section">
        <div className="section-title">Certifications</div>
        <ul className="certifications-list">
          {formData.certifications && formData.certifications.length > 0 ? (
            formData.certifications.map((cert, index) => (
              <li key={index} className="certification-item">
                {cert.value}
              </li>
            ))
          ) : (
            <>
              <li className="certification-item">Photoshop</li>
              <li className="certification-item">CorelDraw</li>
              <li className="certification-item">Figma</li>
              <li className="certification-item">Indesign</li>
            </>
          )}
        </ul>
      </div>

      <div className="logo-section">
  <Image
    src="/assets/white-logo.png"
    alt="Portgig Logo"
    width={120} 
    height={40} 
    className="logo-img"
  />
</div>

    </div>
  )
}

export const generateMinimalistTemplateHTML = (formData: FormData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formData.full_name}_Resume</title>
      <meta charset="UTF-8">
      <style>
        * { 
          margin: 0; 
          padding: 0; 
          box-sizing: border-box;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        body { 
          font-family: 'Inter', 'Arial', sans-serif; 
          background: #f8f9fa !important;
          color: #1f2937;
          line-height: 1.6;
          padding: 60px 50px;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .section {
          margin-bottom: 50px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 25px;
          text-transform: uppercase;
          border-bottom: 2px solid #1f2937;
          padding-bottom: 5px;
          display: inline-block;
          letter-spacing: 1px;
        }
        
        .why-work-list {
          list-style: none;
          padding: 0;
        }
        
        .why-work-item {
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          padding-left: 0;
        }
        
        .skills-list {
          list-style: none;
          padding: 0;
        }
        
        .skill-item {
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
          padding-left: 20px;
          position: relative;
        }
        
        .certifications-list {
          list-style: none;
          padding: 0;
        }
        
        .certification-item {
          margin-bottom: 12px;
          font-size: 14px;
          color: #374151;
          padding-left: 20px;
          position: relative;
        }
        
        .logo-section {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #1e3a8a !important;
          color: white;
          padding: 15px 25px;
          border-top-left-radius: 8px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .logo-img {
          width: 70px;
          height: auto;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          @page {
            margin: 0;
            size: A4;
          }
          
          body { 
            margin: 0 !important; 
            padding: 40px !important;
            background: #f8f9fa !important;
          }
          
          .logo-section {
            background: #1e3a8a !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- Why Work With Me Section -->
      <div class="section">
        <div class="section-title">Why Work With Me?</div>
        <ul class="why-work-list">
          <li class="why-work-item">
            ${formData.experience?.[0]?.contribution || "Designed compelling social media graphics, banners, and ads to increase brand visibility."}
          </li>
          <li class="why-work-item">
            ${formData.experience?.[1]?.contribution || "Created engaging product visuals and promotional materials for online sales."}
          </li>
          <li class="why-work-item">
            Collaborated with marketing teams to develop branding strategies.
          </li>
          <li class="why-work-item">
            Developed brand identity concepts, including logos, typography, and brand guidelines.
          </li>
          <li class="why-work-item">
            Designed marketing assets for digital and print campaigns.
          </li>
        </ul>
      </div>

      <!-- Soft Skills Section -->
      <div class="section">
        <div class="section-title">Soft Skill</div>
        <ul class="skills-list">
          ${
            formData.skills && formData.skills.length > 0
              ? formData.skills.map((skill) => `<li class="skill-item">${skill.value}</li>`).join("")
              : `
              <li class="skill-item">Photoshop</li>
              <li class="skill-item">CorelDraw</li>
              <li class="skill-item">Figma</li>
              <li class="skill-item">Indesign</li>
              `
          }
        </ul>
      </div>

      <!-- Certifications Section -->
      <div class="section">
        <div class="section-title">Certifications</div>
        <ul class="certifications-list">
          ${
            formData.certifications && formData.certifications.length > 0
              ? formData.certifications.map((cert) => `<li class="certification-item">${cert.value}</li>`).join("")
              : `
              <li class="certification-item">Photoshop</li>
              <li class="certification-item">CorelDraw</li>
              <li class="certification-item">Figma</li>
              <li class="certification-item">Indesign</li>
              `
          }
        </ul>
      </div>

      <!-- Logo positioned at bottom right -->
      <div class="logo-section">
        <img src="/assets/white-logo.png" alt="Portgig Logo" style="width: 70px; height: auto;" />
      </div>
    </body>
    </html>
  `
}

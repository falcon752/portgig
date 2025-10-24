"use client"

import type React from "react"
import type { FormData } from "@/types/resume"
import Image from "next/image"

interface ExecutiveTemplateProps {
  formData: FormData
}

export const ExecutiveTemplate: React.FC<ExecutiveTemplateProps> = ({ formData }) => {
  return (
    <div className="professional-template">
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .executive-template { 
          font-family: 'Inter', 'Arial', sans-serif; 
          background: white;
          color: #333;
          line-height: 1.5;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
        }
        
        .header {
          background: #0A1754;
          color: white;
          padding: 30px 40px;
          position: relative;
        }
        
        .logo {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 40px;
          color: white;
        }

        .logo-img {
          width: 50px;
          height: auto;
          margin-bottom: 40px;
        }
        
        .name-section {
          text-align: center;
        }
        
        .name {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .job-title {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 2px;
          margin-bottom: 25px;
          text-transform: uppercase;
        }
        
        .contact-row {
          display: flex;
          justify-content: center;
          gap: 30px;
          font-size: 14px;
          flex-wrap: wrap;
        }
        
        .contact-item {
          color: white;
        }
        
        .main-content {
          padding: 0;
          background: white;
        }
        
        .social-section {
          background: #f8f9fa;
          padding: 15px 40px;
          display: flex;
          gap: 40px;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .social-item {
          font-size: 14px;
          color: #666;
        }
        
        .close-btn {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          color: #999;
          cursor: pointer;
        }
        
        .content-section {
          padding: 30px 40px;
        }
        
        .section {
          margin-bottom: 35px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          text-transform: uppercase;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .brief-text {
          font-size: 14px;
          line-height: 1.7;
          color: #374151;
          text-align: justify;
        }
        
        .education-item {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .education-item:last-child {
          border-bottom: none;
        }
        
        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        
        .education-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .education-year {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .education-school {
          font-size: 14px;
          color: #4b5563;
          font-style: italic;
        }
        
        .experience-item {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .experience-item:last-child {
          border-bottom: none;
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        
        .experience-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .experience-location {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 8px;
        }
        
        .experience-date {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .experience-description {
          margin-top: 12px;
        }
        
        .experience-description p {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 8px;
        }
        
        @media print {
          .executive-template { 
            box-shadow: none; 
            margin: 0; 
          }
        }
      `}</style>

      <div className="header">
        <Image src="/assets/white-logo.png" alt="Portvig Logo" className="logo-img" width={40} height={40}/>
        <div className="name-section">
          <div className="name">{formData.full_name}</div>
          <div className="job-title">{formData.job_title}</div>
          <div className="contact-row">
            <div className="contact-item">{formData.email}</div>
            <div className="contact-item">{formData.location}</div>
            <div className="contact-item">{formData.phone_number}</div>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Social Links Section */}
        <div className="social-section">
          {formData.links?.instagram && <div className="social-item">Instagram: {formData.links.instagram}</div>}
          {formData.links?.linkedin && <div className="social-item">LinkedIn: {formData.links.linkedin}</div>}
          {formData.links?.twitter && <div className="social-item">Twitter: {formData.links.twitter}</div>}
          {formData.links?.tiktok && <div className="social-item">TikTok: {formData.links.tiktok}</div>}
          {!formData.links?.instagram &&
            !formData.links?.linkedin &&
            !formData.links?.twitter &&
            !formData.links?.tiktok && (
              <>
                <div className="social-item">Instagram name</div>
                <div className="social-item">LinkedIn</div>
              </>
            )}
          <button className="close-btn">×</button>
        </div>

        <div className="content-section">
          {/* Professional Brief */}
          {formData.brief && (
            <div className="section">
              <div className="section-title">Professional Brief</div>
              <div className="brief-text">{formData.brief}</div>
            </div>
          )}

          {/* Education */}
          <div className="section">
            <div className="section-title">Education</div>
            {formData.education && formData.education.length > 0 ? (
              formData.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-header">
                    <div className="education-title">{edu.course}</div>
                    <div className="education-year">
                      {edu.started && edu.ended ? `${edu.started}-${edu.ended}` : ""}
                    </div>
                  </div>
                  <div className="education-school">{edu.school}</div>
                </div>
              ))
            ) : (
              <>
                <div className="education-item">
                  <div className="education-header">
                    <div className="education-title">Mass Communications</div>
                    <div className="education-year">2018-2025</div>
                  </div>
                  <div className="education-school">University of Lagos</div>
                </div>
                <div className="education-item">
                  <div className="education-header">
                    <div className="education-title">Mass Communication MSC</div>
                    <div className="education-year">2023- 2025</div>
                  </div>
                  <div className="education-school">Unilag</div>
                </div>
              </>
            )}
          </div>

          {/* Work Experience */}
          <div className="section">
            <div className="section-title">Work Experience</div>
            {formData.experience && formData.experience.length > 0 ? (
              formData.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <div className="experience-title">{exp.job_title}</div>
                    <div className="experience-date">{exp.ended ? `${exp.ended}` : "Present"}</div>
                  </div>
                  <div className="experience-location">{exp.location}</div>
                  {exp.contribution && (
                    <div className="experience-description">
                      <p>{exp.contribution}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="experience-item">
                <div className="experience-header">
                  <div className="experience-title">Fashion Delight</div>
                  <div className="experience-date">Mainland, Lagos State</div>
                </div>
                <div className="experience-location">2023-2025</div>
                <div className="experience-description">
                  <p>Designed compelling social media graphics, banners, and ads to increase brand visibility.</p>
                  <p>Created engaging product visuals and promotional materials for online sales.</p>
                  <p>Collaborated with marketing teams to develop branding strategies.</p>
                  <p>Developed brand identity concepts, including logos, typography, and brand guidelines.</p>
                  <p>Designed marketing assets for digital and print campaigns.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export const generateExecutiveTemplateHTML = (formData: FormData): string => {
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
          background: white;
          color: #333;
          line-height: 1.5;
        }
        
        .container {
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
        }
        
        .header {
          background: #0A1754 !important;
          color: white;
          padding: 30px 40px;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .logo {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 40px;
          color: white;
        }

        .logo-img {
          width: 50px;
          height: auto;
          margin-bottom: 40px;
        }
        
        .name-section {
          text-align: center;
        }
        
        .name {
          font-size: 42px;
          font-weight: 700;
          letter-spacing: 3px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        
        .job-title {
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 2px;
          margin-bottom: 25px;
          text-transform: uppercase;
        }
        
        .contact-row {
          display: flex;
          justify-content: center;
          gap: 30px;
          font-size: 14px;
          flex-wrap: wrap;
        }
        
        .contact-item {
          color: white;
        }
        
        .main-content {
          padding: 0;
          background: white;
        }
        
        .social-section {
          background: #f8f9fa !important;
          padding: 15px 40px;
          display: flex;
          gap: 40px;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .social-item {
          font-size: 14px;
          color: #666;
        }
        
        .close-btn {
          margin-left: auto;
          background: none;
          border: none;
          font-size: 18px;
          color: #999;
          cursor: pointer;
        }
        
        .content-section {
          padding: 30px 40px;
        }
        
        .section {
          margin-bottom: 35px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 20px;
          text-transform: uppercase;
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .brief-text {
          font-size: 14px;
          line-height: 1.7;
          color: #374151;
          text-align: justify;
        }
        
        .education-item {
          margin-bottom: 25px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .education-item:last-child {
          border-bottom: none;
        }
        
        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        
        .education-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .education-year {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .education-school {
          font-size: 14px;
          color: #4b5563;
          font-style: italic;
        }
        
        .experience-item {
          margin-bottom: 30px;
          padding-bottom: 25px;
          border-bottom: 1px solid #f3f4f6;
        }
        
        .experience-item:last-child {
          border-bottom: none;
        }
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 8px;
        }
        
        .experience-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }
        
        .experience-location {
          font-size: 14px;
          color: #4b5563;
          margin-bottom: 8px;
        }
        
        .experience-date {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .experience-description {
          margin-top: 12px;
        }
        
        .experience-description p {
          font-size: 14px;
          line-height: 1.6;
          color: #374151;
          margin-bottom: 8px;
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
            padding: 0 !important;
          }
          
          .container { 
            box-shadow: none; 
            margin: 0; 
          }
          
          .header {
            background: #0A1754 !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .social-section {
            background: #f8f9fa !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="/assets/white-logo.png" alt="Portvig Logo" style="width: 50px; height: auto; margin-bottom: 40px;" />
          <div class="name-section">
            <div class="name">${formData.full_name}</div>
            <div class="job-title">${formData.job_title}</div>
            <div class="contact-row">
              <div class="contact-item">${formData.email}</div>
              <div class="contact-item">${formData.location}</div>
              <div class="contact-item">${formData.phone_number}</div>
            </div>
          </div>
        </div>

        <div class="main-content">
          <!-- Social Links Section -->
          <div class="social-section">
            ${formData.links?.instagram ? `<div class="social-item">Instagram: ${formData.links.instagram}</div>` : ""}
            ${formData.links?.linkedin ? `<div class="social-item">LinkedIn: ${formData.links.linkedin}</div>` : ""}
            ${formData.links?.twitter ? `<div class="social-item">Twitter: ${formData.links.twitter}</div>` : ""}
            ${formData.links?.tiktok ? `<div class="social-item">TikTok: ${formData.links.tiktok}</div>` : ""}
            ${
              !formData.links?.instagram &&
              !formData.links?.linkedin &&
              !formData.links?.twitter &&
              !formData.links?.tiktok
                ? `<div class="social-item">Instagram name</div>
               <div class="social-item">LinkedIn</div>`
                : ""
            }
            <button class="close-btn">×</button>
          </div>

          <div class="content-section">
            <!-- Professional Brief -->
            ${
              formData.brief
                ? `
            <div class="section">
              <div class="section-title">Professional Brief</div>
              <div class="brief-text">${formData.brief}</div>
            </div>
            `
                : ""
            }

            <!-- Education -->
            <div class="section">
              <div class="section-title">Education</div>
              ${
                formData.education && formData.education.length > 0
                  ? formData.education
                      .map(
                        (edu) => `
                <div class="education-item">
                  <div class="education-header">
                    <div class="education-title">${edu.course}</div>
                    <div class="education-year">${edu.started && edu.ended ? `${edu.started}-${edu.ended}` : ""}</div>
                  </div>
                  <div class="education-school">${edu.school}</div>
                </div>
              `,
                      )
                      .join("")
                  : `
                <div class="education-item">
                  <div class="education-header">
                    <div class="education-title">Mass Communications</div>
                    <div class="education-year">2018-2025</div>
                  </div>
                  <div class="education-school">University of Lagos</div>
                </div>
                <div class="education-item">
                  <div class="education-header">
                    <div class="education-title">Mass Communication MSC</div>
                    <div class="education-year">2023- 2025</div>
                  </div>
                  <div class="education-school">Unilag</div>
                </div>
              `
              }
            </div>

            <!-- Work Experience -->
            <div class="section">
              <div class="section-title">Work Experience</div>
              ${
                formData.experience && formData.experience.length > 0
                  ? formData.experience
                      .map(
                        (exp) => `
                <div class="experience-item">
                  <div class="experience-header">
                    <div class="experience-title">${exp.job_title}</div>
                    <div class="experience-date">${exp.ended ? exp.ended : "Present"}</div>
                  </div>
                  <div class="experience-location">${exp.location}</div>
                  ${exp.contribution ? `<div class="experience-description"><p>${exp.contribution}</p></div>` : ""}
                </div>
              `,
                      )
                      .join("")
                  : `
                <div class="experience-item">
                  <div class="experience-header">
                    <div class="experience-title">Fashion Delight</div>
                    <div class="experience-date">Mainland, Lagos State</div>
                  </div>
                  <div class="experience-location">2023-2025</div>
                  <div class="experience-description">
                    <p>Designed compelling social media graphics, banners, and ads to increase brand visibility.</p>
                    <p>Created engaging product visuals and promotional materials for online sales.</p>
                    <p>Collaborated with marketing teams to develop branding strategies.</p>
                    <p>Developed brand identity concepts, including logos, typography, and brand guidelines.</p>
                    <p>Designed marketing assets for digital and print campaigns.</p>
                  </div>
                </div>
              `
              }
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
}

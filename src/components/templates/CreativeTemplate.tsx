

"use client"

import type React from "react"
import type { FormData } from "@/types/resume"
import Image from "next/image"

interface CreativeTemplateProps {
  formData: FormData
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ formData }) => {
  return (
    <div className="creative-template">
      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .creative-template { 
          font-family: 'Inter', 'Arial', sans-serif; 
          background: #e5e7eb;
          color: #374151;
          line-height: 1.5;
          padding: 40px;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          position: relative;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          text-transform: uppercase;
          border-bottom: 2px solid #1f2937;
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .experience-item {
          margin-bottom: 30px;
          background: transparent;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-field {
          background: #d1d5db;
          border: none;
          padding: 15px 20px;
          border-radius: 4px;
          font-size: 14px;
          color: #374151;
          min-height: 50px;
          display: flex;
          align-items: center;
          font-family: 'Inter', 'Arial', sans-serif;
        }
        
        .form-field.large {
          min-height: 120px;
          align-items: flex-start;
          padding-top: 20px;
          text-align: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
        }
        
        .form-field.placeholder {
          color: #6b7280;
          font-style: italic;
        }
        
        .logo-section {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #1e3a8a;
          color: white;
          padding: 20px 30px;
          border-top-left-radius: 8px;
        }
        
        .logo-text {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .logo-img {
          width: 80px;
          height: auto;
        }
        
        @media print {
          .creative-template { 
            padding: 30px;
            background: #e5e7eb !important;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .form-field {
            background: #d1d5db !important;
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

      {/* Work Experience Sections */}
      <div className="section">
        <div className="section-title">Work Experience</div>

        {formData.experience && formData.experience.length > 0 ? (
          formData.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="form-row">
                <div className="form-field">{exp.job_title || "Brand"}</div>
              </div>
              <div className="form-row">
                <div className="form-field">{exp.location || "Location"}</div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  {exp.ended ? `What year- ended ${exp.ended}` : "What year- ended when"}
                </div>
              </div>
              <div className="form-row">
                <div className="form-field large">{exp.contribution || "How did you help/what did you do"}</div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* First Work Experience */}
            <div className="experience-item">
              <div className="form-row">
                <div className="form-field placeholder">Brand</div>
              </div>
              <div className="form-row">
                <div className="form-field placeholder">Location</div>
              </div>
              <div className="form-row">
                <div className="form-field placeholder">What year- ended when</div>
              </div>
              <div className="form-row">
                <div className="form-field large placeholder">How did you help/what did you do</div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Second Work Experience Section */}
      <div className="section">
        <div className="section-title">Work Experience</div>

        {formData.experience && formData.experience.length > 1 ? (
          <div className="experience-item">
            <div className="form-row">
              <div className="form-field">{formData.experience[1]?.job_title || "Brand"}</div>
            </div>
            <div className="form-row">
              <div className="form-field">{formData.experience[1]?.location || "Location"}</div>
            </div>
            <div className="form-row">
              <div className="form-field">
                {formData.experience[1]?.ended
                  ? `What year- ended ${formData.experience[1].ended}`
                  : "What year- ended when"}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field large">
                {formData.experience[1]?.contribution || "How did you help/what did you do"}
              </div>
            </div>
          </div>
        ) : (
          <div className="experience-item">
            <div className="form-row">
              <div className="form-field placeholder">Brand</div>
            </div>
            <div className="form-row">
              <div className="form-field placeholder">Location</div>
            </div>
            <div className="form-row">
              <div className="form-field placeholder">What year- ended when</div>
            </div>
            <div className="form-row">
              <div className="form-field large placeholder">How did you help/what did you do</div>
            </div>
          </div>
        )}
      </div>

      {/* Logo positioned at bottom right */}
      <div className="logo-section">
        <Image src="/assets/white-logo.png" alt="Portgig Logo" className="logo-img" width={40} height={40}/>
      </div>
    </div>
  )
}

export const generateCreativeTemplateHTML = (formData: FormData): string => {
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
          background: #e5e7eb !important;
          color: #374151;
          line-height: 1.5;
          padding: 40px;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .section {
          margin-bottom: 40px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 20px;
          text-transform: uppercase;
          border-bottom: 2px solid #1f2937;
          padding-bottom: 8px;
          display: inline-block;
        }
        
        .experience-item {
          margin-bottom: 30px;
          background: transparent;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-field {
          background: #d1d5db !important;
          border: none;
          padding: 15px 20px;
          border-radius: 4px;
          font-size: 14px;
          color: #374151;
          min-height: 50px;
          display: flex;
          align-items: center;
          font-family: 'Inter', 'Arial', sans-serif;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .form-field.large {
          min-height: 120px;
          align-items: flex-start;
          padding-top: 20px;
          text-align: center;
          justify-content: center;
          display: flex;
          flex-direction: column;
        }
        
        .form-field.placeholder {
          color: #6b7280;
          font-style: italic;
        }
        
        .logo-section {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #1e3a8a !important;
          color: white;
          padding: 20px 30px;
          border-top-left-radius: 8px;
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .logo-text {
          font-size: 18px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .logo-img {
          width: 80px;
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
            padding: 30px !important;
            background: #e5e7eb !important;
          }
          
          .form-field {
            background: #d1d5db !important;
          }
          
          .logo-section {
            background: #1e3a8a !important;
          }
        }
      </style>
    </head>
    <body>
      <!-- Work Experience Sections -->
      <div class="section">
        <div class="section-title">Work Experience</div>
        
        ${
          formData.experience && formData.experience.length > 0
            ? formData.experience
                .map(
                  (exp) => `
            <div class="experience-item">
              <div class="form-row">
                <div class="form-field">
                  ${exp.job_title || "Brand"}
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  ${exp.location || "Location"}
                </div>
              </div>
              <div class="form-row">
                <div class="form-field">
                  ${exp.ended ? `What year- ended ${exp.ended}` : "What year- ended when"}
                </div>
              </div>
              <div class="form-row">
                <div class="form-field large">
                  ${exp.contribution || "How did you help/what did you do"}
                </div>
              </div>
            </div>
          `,
                )
                .join("")
            : `
            <!-- First Work Experience -->
            <div class="experience-item">
              <div class="form-row">
                <div class="form-field placeholder">Brand</div>
              </div>
              <div class="form-row">
                <div class="form-field placeholder">Location</div>
              </div>
              <div class="form-row">
                <div class="form-field placeholder">What year- ended when</div>
              </div>
              <div class="form-row">
                <div class="form-field large placeholder">
                  How did you help/what did you do
                </div>
              </div>
            </div>
          `
        }
      </div>

      <!-- Second Work Experience Section -->
      <div class="section">
        <div class="section-title">Work Experience</div>
        
        ${
          formData.experience && formData.experience.length > 1
            ? `
          <div class="experience-item">
            <div class="form-row">
              <div class="form-field">
                ${formData.experience[1]?.job_title || "Brand"}
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                ${formData.experience[1]?.location || "Location"}
              </div>
            </div>
            <div class="form-row">
              <div class="form-field">
                ${formData.experience[1]?.ended ? `What year- ended ${formData.experience[1].ended}` : "What year- ended when"}
              </div>
            </div>
            <div class="form-row">
              <div class="form-field large">
                ${formData.experience[1]?.contribution || "How did you help/what did you do"}
              </div>
            </div>
          </div>
        `
            : `
          <div class="experience-item">
            <div class="form-row">
              <div class="form-field placeholder">Brand</div>
            </div>
            <div class="form-row">
              <div class="form-field placeholder">Location</div>
            </div>
            <div class="form-row">
              <div class="form-field placeholder">What year- ended when</div>
            </div>
            <div class="form-row">
              <div class="form-field large placeholder">
                How did you help/what did you do
              </div>
            </div>
          </div>
        `
        }
      </div>

      <!-- Logo positioned at bottom right -->
      <div class="logo-section">
        <img src="/assets/white-logo.png" alt="Portvig Logo" style="width: 80px; height: auto;" />
      </div>
    </body>
    </html>
  `
}

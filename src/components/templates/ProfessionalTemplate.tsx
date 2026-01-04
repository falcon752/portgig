"use client";

import type React from "react";
import type { FormData } from "@/types/resume";
import Image from "next/image";

interface ProfessionalTemplateProps {
  formData: FormData;
}

export const ProfessionalTemplate: React.FC<ProfessionalTemplateProps> = ({
  formData,
}) => {
  // Helper function to format dates with short month abbreviations
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="professional-template">
      <style jsx>{`
        body {
          font-family: "Inter", "Arial", sans-serif;
          background: white;
          color: #333;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .professional-template {
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
        }

        .header {
          background: #0a1754;
          color: white;
          padding: 15px 30px 20px 30px;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
          page-break-after: auto;
        }

        .logo-img {
          width: 50px;
          height: auto;
          margin-bottom: 10px;
        }

        .name-section {
          text-align: center;
          margin-bottom: 10px;
        }

        .name {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: 1.2px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .job-title {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.8px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .contact-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 10px;
          flex-wrap: wrap;
        }

        .contact-item {
          color: white;
        }

        .main-content {
          padding: 15px 20px;
          background: #f8f9fa;
          min-height: calc(297mm - 60px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          -webkit-print-color-adjust: exact !important;
        }

        .social-section {
          background: white;
          padding: 6px 10px;
          margin-bottom: 10px;
          border-radius: 4px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .social-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }

        .section {
          margin-bottom: 8px;
          page-break-inside: avoid;
          page-break-before: auto;
          page-break-after: auto;
          width: 100%;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 10px;
          text-transform: uppercase;
          border-bottom: 1.5px solid #1e3a8a;
          padding-bottom: 4px;
          display: inline-block;
          page-break-after: avoid;
        }

        .brief-area {
          padding: 10px 0;
          color: #0a1754;
          font-family: "Raleway", sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .education-item {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }

        .field {
          padding: 10px 0;
          font-size: 13px;
          color: #374151;
          min-height: auto;
          display: flex;
          align-items: center;
          -webkit-print-color-adjust: exact !important;
        }

        .user-input-text {
          color: #0a1754;
          font-family: "Raleway", sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .experience-section {
          margin-top: 15px;
          page-break-inside: avoid;
        }

        .experience-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }

        .experience-description {
          padding: 10px 0;
          color: #0a1754;
          font-family: "Raleway", sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          text-align: left;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          word-wrap: break-word;
          overflow-wrap: break-word;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .field-label {
          font-size: 9px;
          color: #1e3a8a;
          font-weight: 600;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .field-with-label {
          display: flex;
          flex-direction: column;
          page-break-inside: avoid;
        }

        .skills-list,
        .other-skills-list,
        .certifications-list {
          list-style-type: disc;
          margin-left: 15px;
          margin-bottom: 10px;
          width: 100%;
          page-break-inside: avoid;
        }

        .skill-item,
        .other-skill-item,
        .certification-item {
          color: #0a1754;
          font-family: "Raleway", sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          padding: 2px 0;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          .professional-template {
            box-shadow: none;
            margin: 0;
          }

          @page {
            margin: 15mm 0 0 0;
            size: A4;
          }

          @page :not(:first-child) {
            margin-top: 20mm;
          }

          .header {
            background: #0a1754;
            -webkit-print-color-adjust: exact !important;
            page-break-inside: avoid;
          }

          .main-content {
            background: #f8f9fa;
            -webkit-print-color-adjust: exact !important;
          }

          .social-section {
            background: white;
            -webkit-print-color-adjust: exact !important;
            page-break-inside: avoid;
          }

          .section {
            page-break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
            margin-top: 10px;
          }

          .experience-description,
          .brief-area,
          .skill-item,
          .other-skill-item,
          .certification-item,
          .user-input-text {
            page-break-inside: avoid;
            -webkit-hyphens: none !important;
            -moz-hyphens: none !important;
            hyphens: none !important;
            word-break: normal;
          }

          .education-item,
          .experience-fields,
          .field-with-label,
          .skills-list,
          .other-skills-list,
          .certifications-list {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="header">
        <Image
          src="/assets/white-logo.png"
          alt="Portgig Logo"
          className="logo-img"
          width={50}
          height={50}
        />
        <div className="name-section">
          <div className="name">{formData.full_name || "Not specified"}</div>
          <div className="job-title">
            {formData.job_title || "Not specified"}
          </div>
          <div className="contact-row">
            {formData.email && (
              <div className="contact-item">{formData.email}</div>
            )}
            {formData.location && formData.email ? <span>|</span> : ""}
            {formData.location && (
              <div className="contact-item">{formData.location}</div>
            )}
            {formData.phone_number && (formData.email || formData.location) ? (
              <span>|</span>
            ) : (
              ""
            )}
            {formData.phone_number && (
              <div className="contact-item">{formData.phone_number}</div>
            )}
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Social Links Section */}
        <div className="social-section">
          {formData.links?.instagram && (
            <div className="social-item">
              <span>Instagram: {formData.links.instagram}</span>
            </div>
          )}
          {formData.links?.linkedin && (
            <div className="social-item">
              <span>LinkedIn: {formData.links.linkedin}</span>
            </div>
          )}
          {formData.links?.twitter && (
            <div className="social-item">
              <span>Twitter: {formData.links.twitter}</span>
            </div>
          )}
          {formData.links?.tiktok && (
            <div className="social-item">
              <span>TikTok: {formData.links.tiktok}</span>
            </div>
          )}
        </div>

        {/* Professional Brief */}
        {formData.brief && (
          <div className="section">
            <div className="section-title">Professional Brief</div>
            <div className="brief-area">{formData.brief}</div>
          </div>
        )}

        {/* Education */}
        <div className="section">
          <div className="section-title">Education</div>
          {formData.education && formData.education.length > 0 ? (
            formData.education.map((edu, index) => (
              <div
                key={index}
                className="education-item"
                style={{ marginBottom: "10px" }}
              >
                <div className="field-with-label">
                  <div className="field-label">Course/Degree</div>
                  <div className="field">
                    <span className="user-input-text">
                      {edu.course || "Not specified"}
                    </span>
                  </div>
                  <div className="field-label">School/Institution</div>
                  <div className="field">
                    <span className="user-input-text">
                      {edu.school || "Not specified"}
                    </span>
                  </div>
                </div>
                <div className="field-with-label">
                  <div className="field-label">Duration</div>
                  <div className="field">
                    <span className="user-input-text">
                      {edu.started && edu.ended
                        ? `${formatDate(edu.started)} - ${formatDate(
                            edu.ended
                          )}`
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="education-item" style={{ marginBottom: "10px" }}>
              <div className="field-with-label">
                <div className="field-label">Course/Degree</div>
                <div className="field"></div>
                <div className="field-label">School/Institution</div>
                <div className="field"></div>
              </div>
              <div className="field-with-label">
                <div className="field-label">Duration</div>
                <div className="field"></div>
              </div>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="section experience-section">
          <div className="section-title">Work Experience</div>
          {formData.experience && formData.experience.length > 0 ? (
            formData.experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: "15px" }}>
                <div className="experience-fields">
                  <div className="field-with-label">
                    <div className="field-label">Job Title/Brand</div>
                    <div className="field">
                      <span className="user-input-text">
                        {exp.job_title || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="field-with-label">
                    <div className="field-label">Company/Location</div>
                    <div className="field">
                      <span className="user-input-text">
                        {exp.location || "Not specified"}
                      </span>
                    </div>
                  </div>
                  <div className="field-with-label">
                    <div className="field-label">Duration</div>
                    <div className="field">
                      <span className="user-input-text">
                        {exp.started && exp.ended
                          ? `${formatDate(exp.started)} - ${formatDate(
                              exp.ended
                            )}`
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="field-with-label">
                  <div className="field-label">
                    Job Description/Contribution
                  </div>
                  <div className="experience-description">
                    {exp.contribution || "Not specified"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ marginBottom: "15px" }}>
              <div className="experience-fields">
                <div className="field-with-label">
                  <div className="field-label">Job Title/Brand</div>
                  <div className="field"></div>
                </div>
                <div className="field-with-label">
                  <div className="field-label">Company/Location</div>
                  <div className="field"></div>
                </div>
                <div className="field-with-label">
                  <div className="field-label">Duration</div>
                  <div className="field"></div>
                </div>
              </div>
              <div className="field-with-label">
                <div className="field-label">Job Description/Contribution</div>
                <div className="experience-description"></div>
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {formData.skills && formData.skills.length > 0 && (
          <div className="section">
            <div className="section-title">Skills</div>
            <ul className="skills-list">
              {formData.skills.map((skill, index) => (
                <li key={index} className="skill-item">
                  {skill.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Other Skills Section */}
        {formData.other_skills && formData.other_skills.length > 0 && (
          <div className="section">
            <div className="section-title">Other Skills</div>
            <ul className="other-skills-list">
              {formData.other_skills.map((skill, index) => (
                <li key={index} className="other-skill-item">
                  {skill.value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications Section */}
        {formData.certifications && formData.certifications.length > 0 && (
          <div className="section">
            <div className="section-title">Certifications</div>
            <ul className="certifications-list">
              {formData.certifications.map((cert, index) => (
                <li key={index} className="certification-item">
                  {cert.value}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export const generateProfessionalTemplateHTML = (
  formData: FormData
): string => {
  // Helper function to format dates with short month abbreviations
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return dateString;
    }
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${formData.full_name || "Resume"}_Resume</title>
      <meta charset="UTF-8">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Raleway:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', 'Arial', sans-serif;
          background: white;
          color: #333;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 0 15px;
        }

        .header {
          background: #0A1754;
          color: white;
          padding: 8px 20px 10px 20px;
          position: relative;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
          page-break-after: auto;
        }

        .logo-img {
          width: 42px;
          height: auto;
          margin-bottom: 5px;
        }

        .name-section {
          text-align: center;
          margin-bottom: 5px;
        }

        .name {
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.8px;
          margin-bottom: 3px;
          text-transform: uppercase;
        }

        .job-title {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .contact-row {
          display: flex;
          justify-content: center;
          gap: 15px;
          font-size: 10px;
          flex-wrap: wrap;
        }

        .contact-item {
          color: white;
        }

        .main-content {
          padding: 15px 20px;
          background: #f8f9fa;
          min-height: calc(297mm - 60px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          -webkit-print-color-adjust: exact !important;
        }

        .social-section {
          background: white;
          padding: 6px 10px;
          margin-bottom: 10px;
          border-radius: 4px;
          display: flex;
          gap: 20px;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .social-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #666;
        }


        .section {
          margin-bottom: 8px;
          page-break-inside: avoid;
          page-break-before: auto;
          page-break-after: auto;
          width: 100%;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 10px;
          text-transform: uppercase;
          border-bottom: 1.5px solid #1e3a8a;
          padding-bottom: 4px;
          display: inline-block;
          page-break-after: avoid;
        }

        .brief-area {
          padding: 10px 0;
          color: #0A1754;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          word-wrap: break-word;
          overflow-wrap: break-word;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .education-item {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }

        .field {
          padding: 10px 0;
          font-size: 13px;
          color: #374151;
          min-height: auto;
          display: flex;
          align-items: center;
          -webkit-print-color-adjust: exact !important;
        }

        .user-input-text {
          color: #0A1754;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          word-wrap: break-word;
          overflow-wrap: break-word;
        }

        .field-label {
          font-size: 9px;
          color: #1e3a8a;
          font-weight: 600;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .field-with-label {
          display: flex;
          flex-direction: column;
          page-break-inside: avoid;
        }

        .skills-list,
        .other-skills-list,
        .certifications-list {
          list-style-type: disc;
          margin-left: 15px;
          margin-bottom: 10px;
          width: 100%;
          page-break-inside: avoid;
        }

        .skill-item,
        .other-skill-item,
        .certification-item {
          color: #0A1754;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 8px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          padding: 2px 0;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        .experience-fields {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
          page-break-inside: avoid;
        }

        .experience-description {
          padding: 10px 0;
          color: #0A1754;
          font-family: 'Raleway', sans-serif;
          font-weight: 600;
          font-size: 13px;
          line-height: 1.5;
          letter-spacing: 0%;
          text-align: left;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          word-wrap: break-word;
          overflow-wrap: break-word;
          -webkit-print-color-adjust: exact !important;
          page-break-inside: avoid;
        }

        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          .container {
            box-shadow: none;
            margin: 0;
          }

          @page {
            margin: 15mm 0 0 0;
            size: A4;
          }

          @page :not(:first-child) {
            margin-top: 20mm;
          }

          .header {
            background: #0A1754;
            -webkit-print-color-adjust: exact !important;
            page-break-inside: avoid;
          }

          .main-content {
            background: #f8f9fa;
            -webkit-print-color-adjust: exact !important;
          }

          .social-section {
            background: white;
            -webkit-print-color-adjust: exact !important;
            page-break-inside: avoid;
          }

          .section {
            page-break-inside: avoid;
            page-break-before: auto;
            page-break-after: auto;
            margin-top: 10px;
          }

          .experience-description,
          .brief-area,
          .skill-item,
          .other-skill-item,
          .certification-item,
          .user-input-text {
            page-break-inside: avoid;
            -webkit-hyphens: none !important;
            -moz-hyphens: none !important;
            hyphens: none !important;
            word-break: normal;
          }

          .education-item,
          .experience-fields,
          .field-with-label,
          .skills-list,
          .other-skills-list,
          .certifications-list {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="/assets/white-logo.png" alt="Portgig Logo" class="logo-img" />
          <div class="name-section">
            <div class="name">${formData.full_name || "Not specified"}</div>
            <div class="job-title">${
              formData.job_title || "Not specified"
            }</div>
            <div class="contact-row">
              ${
                formData.email
                  ? `<div class="contact-item">${formData.email}</div>`
                  : ""
              }
              ${formData.location && formData.email ? `<span>|</span>` : ""}
              ${
                formData.location
                  ? `<div class="contact-item">${formData.location}</div>`
                  : ""
              }
              ${
                formData.phone_number && (formData.email || formData.location)
                  ? `<span>|</span>`
                  : ""
              }
              ${
                formData.phone_number
                  ? `<div class="contact-item">${formData.phone_number}</div>`
                  : ""
              }
            </div>
          </div>
        </div>

        <div class="main-content">
          <!-- Social Links Section -->
          <div class="social-section">
            ${
              formData.links?.instagram
                ? `<div class="social-item"><span>Instagram: ${formData.links.instagram}</span></div>`
                : ""
            }
            ${
              formData.links?.linkedin
                ? `<div class="social-item"><span>LinkedIn: ${formData.links.linkedin}</span></div>`
                : ""
            }
            ${
              formData.links?.twitter
                ? `<div class="social-item"><span>Twitter: ${formData.links.twitter}</span></div>`
                : ""
            }
            ${
              formData.links?.tiktok
                ? `<div class="social-item"><span>TikTok: ${formData.links.tiktok}</span></div>`
                : ""
            }
          </div>

          <!-- Professional Brief -->
          ${
            formData.brief
              ? `
          <div class="section">
            <div class="section-title">Professional Brief</div>
            <div class="brief-area">${formData.brief}</div>
          </div>
          `
              : ""
          }

          <!-- Skills Section -->
          ${
            formData.skills && formData.skills.length > 0
              ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <ul class="skills-list">
              ${formData.skills
                .map((skill) => `<li class="skill-item">${skill.value}</li>`)
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          <!-- Certifications Section -->
          ${
            formData.certifications && formData.certifications.length > 0
              ? `
          <div class="section">
            <div class="section-title">Certifications</div>
            <ul class="certifications-list">
              ${formData.certifications
                .map(
                  (cert) => `<li class="certification-item">${cert.value}</li>`
                )
                .join("")}
            </ul>
          </div>
          `
              : ""
          }

          <!-- Other Skills Section -->
          ${
            formData.other_skills && formData.other_skills.length > 0
              ? `
          <div class="section">
            <div class="section-title">Other Skills</div>
            <ul class="other-skills-list">
              ${formData.other_skills
                .map(
                  (skill) => `<li class="other-skill-item">${skill.value}</li>`
                )
                .join("")}
            </ul>
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
                  <div class="field-with-label">
                    <div class="field-label">Course/Degree</div>
                    <div class="field"><span class="user-input-text">${
                      edu.course || "Not specified"
                    }</span></div>
                    <div class="field-label">School/Institution</div>
                    <div class="field"><span class="user-input-text">${
                      edu.school || "Not specified"
                    }</span></div>
                  </div>
                  <div class="field-with-label">
                    <div class="field-label">Duration</div>
                    <div class="field"><span class="user-input-text">${
                      edu.started && edu.ended
                        ? `${formatDate(edu.started)} - ${formatDate(
                            edu.ended
                          )}`
                        : "Not specified"
                    }</span></div>
                  </div>
                </div>
              `
                    )
                    .join("")
                : `
                <div class="education-item">
                  <div class="field-with-label">
                    <div class="field-label">Course/Degree</div>
                    <div class="field"></div>
                    <div class="field-label">School/Institution</div>
                    <div class="field"></div>
                  </div>
                  <div class="field-with-label">
                    <div class="field-label">Duration</div>
                    <div class="field"></div>
                  </div>
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
                <div style="margin-bottom: 15px; page-break-inside: avoid;">
                  <div class="experience-fields">
                    <div class="field-with-label">
                      <div class="field-label">Job Title/Brand</div>
                      <div class="field"><span class="user-input-text">${
                        exp.job_title || "Not specified"
                      }</span></div>
                    </div>
                    <div class="field-with-label">
                      <div class="field-label">Company/Location</div>
                      <div class="field"><span class="user-input-text">${
                        exp.location || "Not specified"
                      }</span></div>
                    </div>
                    <div class="field-with-label">
                      <div class="field-label">Duration</div>
                      <div class="field"><span class="user-input-text">${
                        exp.started && exp.ended
                          ? `${formatDate(exp.started)} - ${formatDate(
                              exp.ended
                            )}`
                          : "Not specified"
                      }</span></div>
                    </div>
                  </div>
                  <div class="field-with-label">
                    <div class="field-label">Job Description/Contribution</div>
                    <div class="experience-description">${
                      exp.contribution || "Not specified"
                    }</div>
                  </div>
                </div>
              `
                    )
                    .join("")
                : `
                <div style="margin-bottom: 15px; page-break-inside: avoid;">
                  <div class="experience-fields">
                    <div class="field-with-label">
                      <div class="field-label">Job Title/Brand</div>
                      <div class="field"></div>
                    </div>
                    <div class="field-with-label">
                      <div class="field-label">Company/Location</div>
                      <div class="field"></div>
                    </div>
                    <div class="field-with-label">
                      <div class="field-label">Duration</div>
                      <div class="field"></div>
                    </div>
                  </div>
                  <div class="field-with-label">
                    <div class="field-label">Job Description/Contribution</div>
                    <div class="experience-description"></div>
                  </div>
                </div>
              `
            }
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

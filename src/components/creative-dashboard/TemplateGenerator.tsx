/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { FormData } from "@/types/resume";
import { generateProfessionalTemplateHTML } from "@/src/components/templates/ProfessionalTemplate";

export const generateTemplateSpecificPDF = async (
  formData: FormData,
  username: string
): Promise<void> => {
  try {
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm";
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.padding = "2mm 10mm 10mm 10mm";
    tempContainer.style.fontFamily = "'Inter', 'Arial', sans-serif";
    tempContainer.style.boxSizing = "border-box";

    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = generateProfessionalTemplateHTML(formData);
    tempContainer.appendChild(contentDiv);

    document.body.appendChild(tempContainer);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: 794,
      windowWidth: 794,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((element) => {
          const computedStyle = window.getComputedStyle(element as Element);
          const htmlElement = element as HTMLElement;

          if (computedStyle.color && computedStyle.color.includes("oklch")) {
            htmlElement.style.color = "#333333";
          }
          if (
            computedStyle.backgroundColor &&
            computedStyle.backgroundColor.includes("oklch")
          ) {
            htmlElement.style.backgroundColor = "#ffffff";
          }
          if (
            computedStyle.borderColor &&
            computedStyle.borderColor.includes("oklch")
          ) {
            htmlElement.style.borderColor = "#cccccc";
          }
        });
      },
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const imgWidth = 210;
    const pageHeight = 297;
    const pxPerMm = canvas.width / imgWidth;
    const imgHeight = canvas.height / pxPerMm;

    const topMarginFirst = 0;
    const topMarginSubsequent = 10; 
    const bottomMargin = 10; 
    const minRemainingForNewPage = 30; 

    let sourceY_px = 0;
    let pageNum = 0;

    while (sourceY_px < canvas.height) {
      if (pageNum > 0) {
        pdf.addPage();
      }
      pageNum++;

      const topM = pageNum === 1 ? topMarginFirst : topMarginSubsequent;
      let thisBottomM = bottomMargin;
      const avail_mm = pageHeight - topM - thisBottomM;
      const remaining_mm = (canvas.height - sourceY_px) / pxPerMm;

      let proposed_slice_mm = Math.min(remaining_mm, avail_mm);
      const remaining_after_mm = remaining_mm - proposed_slice_mm;

      if (
        remaining_after_mm > 0 &&
        remaining_after_mm <= minRemainingForNewPage &&
        proposed_slice_mm + remaining_after_mm <= pageHeight - topM
      ) {
        proposed_slice_mm += remaining_after_mm;
      }

      const slice_mm = proposed_slice_mm;
      const sliceH_px = Math.min(slice_mm * pxPerMm, remaining_mm * pxPerMm); 

      if (sliceH_px <= 0) break;

      // Create a slice canvas
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceH_px;
      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          sourceY_px,
          canvas.width,
          sliceH_px,
          0,
          0,
          canvas.width,
          sliceH_px
        );
      }

      pdf.addImage(
        sliceCanvas,
        "JPEG",
        0,
        topM,
        imgWidth,
        slice_mm,
        undefined,
        "FAST"
      );

      sourceY_px += sliceH_px;
    }

    document.body.removeChild(tempContainer);

    const fileName = `${username || "Resume"}.pdf`;
    pdf.save(fileName);

    localStorage.setItem(
      `cv_download_professional_blue`,
      new Date().toISOString()
    );
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw new Error("Failed to generate PDF. Please try again.");
  }
};
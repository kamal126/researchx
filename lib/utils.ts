import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { jsPDF } from "jspdf"
import { saveAs } from "file-saver"
import { toast } from "sonner"
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx"
import { DocumentOutline } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const exportDocument = (
  outline: DocumentOutline,
  format: "PDF" | "DOCX",
  topicInfo?: any
) => {
  try {
    // -------------------------------
    // FILTER SELECTED SECTIONS FIRST
    // -------------------------------
    const selectedSections = outline.sections
      .filter((s) => s.isSelected)
      .map((s) => ({
        ...s,
        subtopics: s.subtopics.filter((st) => st.isSelected),
      }));

    // /////////////////////////////////////////////////////////////////
    //                           PDF EXPORT
    // /////////////////////////////////////////////////////////////////
    if (format === "PDF") {
      const doc = new jsPDF();
      let yPosition = 20;
      let pageNumber = 1;

      // -------------------------------
      // TITLE PAGE
      // -------------------------------
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");

      const titleWidth =
        (doc.getStringUnitWidth(outline.mainTopic) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleX = (doc.internal.pageSize.width - titleWidth) / 2;

      doc.text(outline.mainTopic, titleX > 0 ? titleX : 20, 60);

      // Subtitle (academic level)
      if (topicInfo?.academicLevel) {
        doc.setFontSize(14);
        const subtitle = `${topicInfo.academicLevel} Level Research Paper`;
        const subtitleWidth =
          (doc.getStringUnitWidth(subtitle) * 14) /
          doc.internal.scaleFactor;
        const subtitleX =
          (doc.internal.pageSize.width - subtitleWidth) / 2;
        doc.text(subtitle, subtitleX > 0 ? subtitleX : 20, 75);
      }

      // Author
      doc.setFontSize(12);
      const author = "Prepared by: Student Name";
      const authorWidth =
        (doc.getStringUnitWidth(author) * 12) /
        doc.internal.scaleFactor;
      const authorX =
        (doc.internal.pageSize.width - authorWidth) / 2;
      doc.text(author, authorX > 0 ? authorX : 20, 100);

      // Date
      const dateText = `Date: ${new Date().toLocaleDateString()}`;
      const dateWidth =
        (doc.getStringUnitWidth(dateText) * 12) /
        doc.internal.scaleFactor;
      const dateX =
        (doc.internal.pageSize.width - dateWidth) / 2;
      doc.text(dateText, dateX > 0 ? dateX : 20, 110);

      // Institution
      const institution = "Institution: Your Institution Name";
      const instWidth =
        (doc.getStringUnitWidth(institution) * 12) /
        doc.internal.scaleFactor;
      const instX =
        (doc.internal.pageSize.width - instWidth) / 2;
      doc.text(institution, instX > 0 ? instX : 20, 120);

      // Page number
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      pageNumber++;

      // -------------------------------
      // TABLE OF CONTENTS
      // -------------------------------
      doc.addPage();
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
      doc.setFontSize(12);
      pageNumber++;
      yPosition = 20;

      selectedSections.forEach((section, sectionIndex) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${sectionIndex + 1}. ${section.title}`, 20, yPosition);
        doc.text(`${pageNumber + sectionIndex}`, 180, yPosition);
        yPosition += 10;

        doc.setFont("helvetica", "normal");

        section.subtopics.forEach((st, stIndex) => {
          doc.text(
            `   ${sectionIndex + 1}.${stIndex + 1} ${st.title}`,
            20,
            yPosition
          );
          doc.text(`${pageNumber + sectionIndex}`, 180, yPosition);
          yPosition += 8;

          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;

            doc.setFontSize(10);
            doc.text(
              `Page ${pageNumber}`,
              doc.internal.pageSize.width - 30,
              doc.internal.pageSize.height - 10
            );
            pageNumber++;

            doc.setFontSize(12);
          }
        });

        yPosition += 5;
      });

      // -------------------------------
      // CONTENT PAGES
      // -------------------------------
      selectedSections.forEach((section, sectionIndex) => {
        doc.addPage();
        yPosition = 20;

        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
        pageNumber++;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text(`${sectionIndex + 1}. ${section.title}`, 20, yPosition);
        yPosition += 15;

        doc.setFont("helvetica", "normal");

        // Subtopics
        section.subtopics.forEach((subtopic, stIndex) => {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(
            `${sectionIndex + 1}.${stIndex + 1}. ${subtopic.title}`,
            20,
            yPosition
          );
          doc.setFont("helvetica", "normal");
          yPosition += 10;

          // CONTENT (safe)
          doc.setFontSize(12);
          const lines = doc.splitTextToSize(subtopic.content ?? "", 170);

          lines.forEach((line) => {
            if (yPosition > 280) {
              doc.addPage();
              yPosition = 20;

              doc.setFontSize(10);
              doc.text(
                `Page ${pageNumber}`,
                doc.internal.pageSize.width - 30,
                doc.internal.pageSize.height - 10
              );
              pageNumber++;
              doc.setFontSize(12);
            }

            doc.text(line, 20, yPosition);
            yPosition += 7;
          });

          yPosition += 10;
        });
      });

      // Save PDF
      doc.save(`${outline.mainTopic.replace(/\s+/g, "_")}.pdf`);
      toast.success("Your PDF document is downloaded.");
      return;
    }

    // /////////////////////////////////////////////////////////////////
    //                           DOCX EXPORT
    // /////////////////////////////////////////////////////////////////
    if (format === "DOCX") {
      const doc = new Document({
        sections: [
          {
            children: [
              // TITLE
              new Paragraph({
                heading: HeadingLevel.TITLE,
                alignment: "center",
                spacing: { before: 3000, after: 400 },
                children: [
                  new TextRun({
                    text: outline.mainTopic,
                    size: 56,
                    bold: true,
                  }),
                ],
              }),

              ...(topicInfo?.academicLevel
                ? [
                    new Paragraph({
                      alignment: "center",
                      spacing: { after: 400 },
                      children: [
                        new TextRun({
                          text: `${topicInfo.academicLevel} Level Research Paper`,
                          size: 32,
                        }),
                      ],
                    }),
                  ]
                : []),

              new Paragraph({
                alignment: "center",
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Prepared by: Student Name",
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                alignment: "center",
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "Institution: University Name",
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({
                alignment: "center",
                spacing: { before: 400 },
                children: [
                  new TextRun({
                    text: new Date().toLocaleDateString(),
                    size: 24,
                  }),
                ],
              }),

              new Paragraph({ pageBreakBefore: true }),

              // -------------------------
              // TABLE OF CONTENTS
              // -------------------------
              new Paragraph({
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 500, after: 300 },
                children: [
                  new TextRun({
                    text: "Table of Contents",
                    size: 36,
                    bold: true,
                  }),
                ],
              }),

              // TOC Entries
              ...selectedSections.flatMap((section, si) => {
                const arr: Paragraph[] = [];

                arr.push(
                  new Paragraph({
                    spacing: { before: 200, after: 80 },
                    children: [
                      new TextRun({
                        text: `${si + 1}. ${section.title}`,
                        bold: true,
                        size: 24,
                      }),
                    ],
                  })
                );

                section.subtopics.forEach((st, sti) => {
                  arr.push(
                    new Paragraph({
                      spacing: { after: 80 },
                      children: [
                        new TextRun({
                          text: `${si + 1}.${sti + 1} ${st.title}`,
                          size: 24,
                        }),
                      ],
                    })
                  );
                });

                return arr;
              }),

              new Paragraph({ pageBreakBefore: true }),

              // -------------------------
              // DOCUMENT CONTENT
              // -------------------------
              ...selectedSections.flatMap((section, si) => {
                const paragraphs: Paragraph[] = [];

                paragraphs.push(
                  new Paragraph({
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 400, after: 200 },
                    pageBreakBefore: si > 0,
                    children: [
                      new TextRun({
                        text: `${si + 1}. ${section.title}`,
                        size: 32,
                        bold: true,
                      }),
                    ],
                  })
                );

                section.subtopics.forEach((subtopic, sti) => {
                  paragraphs.push(
                    new Paragraph({
                      heading: HeadingLevel.HEADING_2,
                      spacing: { before: 300, after: 120 },
                      children: [
                        new TextRun({
                          text: `${si + 1}.${sti + 1}. ${subtopic.title}`,
                          size: 28,
                          bold: true,
                        }),
                      ],
                    })
                  );

                  paragraphs.push(
                    ...((subtopic.content ?? "")
                      .split("\n\n")
                      .map(
                        (p) =>
                          new Paragraph({
                            spacing: { after: 120 },
                            children: [
                              new TextRun({
                                text: p,
                                size: 24,
                              }),
                            ],
                          })
                      ))
                  );
                });

                return paragraphs;
              }),
            ],
          },
        ],
      });

      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, `${outline.mainTopic.replace(/\s+/g, "_")}.docx`);
        toast.success("Your DOCX file has been downloaded.");
      });
    }

    // END TRY
  } catch (err) {
    console.error(err);
    toast.error("Error exporting document. Please try again.");
  }
};

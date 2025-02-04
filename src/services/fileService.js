// src/services/fileService.js
import * as pdfjsLib from "pdfjs-dist";
import * as txml from "txml";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";

export const fileService = {
  handleCSV(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const contents = e.target.result;
          const rows = contents.split("\r\n");
          const headers = rows[0].split(",");

          const data = rows.slice(1).map((row) => {
            const cells = row.split(",");
            const rowData = {};
            headers.forEach((header, index) => {
              rowData[header] = cells[index];
            });
            return rowData;
          });

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  },

  async handlePDF(file) {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const pdfData = new Uint8Array(e.target.result);
          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          const pdfDoc = await loadingTask.promise;
          const numPages = pdfDoc.numPages;

          let extractedText = "";

          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            extractedText +=
              textContent.items.map((item) => item.str).join(" ") + "\n";
          }

          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsArrayBuffer(file);
    });
  },

  handleOFX(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const ofxString = e.target.result;
          const objtree = txml.parse(ofxString);

          const transactions =
            objtree[1]?.children[1]?.children[0]?.children[2]?.children[2]
              ?.children;
          const data = transactions
            .filter((txn) => txn.tagName === "STMTTRN")
            .map((txn) => ({
              date: txn.children[1].children[0],
              description: txn.children[4].children[0],
              value: txn.children[2].children[0],
            }));

          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  },
};

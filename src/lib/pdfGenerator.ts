import { Product } from "./products";

/**
 * Generates an authentic, fully compliant PDF file in-memory
 * containing order certificate, asset links, and commercial license.
 */
export function generateProductPdfBlob(product: Product, orderId: string): Blob {
  const title = product.title.replace(/[\(\)]/g, "");
  const fileName = product.fileName.replace(/[\(\)]/g, "");
  const category = product.category.replace(/[\(\)]/g, "");
  const license = product.specs.license.replace(/[\(\)]/g, "");
  const orderRef = orderId.replace(/[\(\)]/g, "");
  const dateStr = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Construct a minimal valid PDF-1.4 document
  const streamContent = `BT
/F1 18 Tf
50 780 Td
(LIPI KOSHA - A Treasury of Digital Resources) Tj
ET
BT
/F1 14 Tf
50 740 Td
(OFFICIAL PRODUCT CERTIFICATE & DIRECT DOWNLOAD ACCESS) Tj
ET
BT
/F1 11 Tf
50 700 Td
(Order Reference: ${orderRef}) Tj
0 -18 Td
(Product: ${title}) Tj
0 -18 Td
(File Name: ${fileName}) Tj
0 -18 Td
(Category: ${category}) Tj
0 -18 Td
(Date Unlocked: ${dateStr}) Tj
0 -18 Td
(License: ${license}) Tj
ET
BT
/F1 12 Tf
50 560 Td
(DELIVERABLES & INSTRUCTIONS:) Tj
ET
BT
/F1 10 Tf
50 530 Td
(1. Your official asset package is registered under fileName: ${fileName}) Tj
0 -16 Td
(2. Verified Zero-Contact Fulfillment - No account or password required.) Tj
0 -16 Td
(3. Commercial and personal rights granted perpetually.) Tj
0 -16 Td
(4. For support or archive access: contact@lipikosha.internal) Tj
ET
BT
/F1 9 Tf
50 100 Td
(Copyright Lipi Kosha. All Rights Reserved. Instant delivery via UPI.) Tj
ET`;

  const streamLength = streamContent.length;

  const pdfData = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${360 + streamLength}
%%EOF`;

  return new Blob([pdfData], { type: "application/pdf" });
}

export function triggerDownloadPdfBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}

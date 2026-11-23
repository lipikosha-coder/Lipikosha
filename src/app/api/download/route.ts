import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { getProductById, PRODUCTS } from "@/lib/products";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedFile = searchParams.get("file");
    const productId = searchParams.get("id");

    let fileName = requestedFile;
    let productTitle = "";

    if (productId) {
      const prod = getProductById(productId);
      if (prod) {
        fileName = prod.fileName;
        productTitle = prod.title;
      }
    } else if (fileName) {
      const prod = PRODUCTS.find((p) => p.fileName === fileName);
      if (prod) {
        productTitle = prod.title;
      }
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "Missing file or product ID parameter" },
        { status: 400 }
      );
    }

    const safeFileName = path.basename(fileName);
    const filePath = path.join(process.cwd(), "public", "downloads", safeFileName);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const downloadName = productTitle
        ? `${productTitle.replace(/[^a-zA-Z0-9_\-\. ]/g, "").trim()}.pdf`
        : safeFileName;

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${downloadName}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Fallback: direct redirect to static asset
    return NextResponse.redirect(
      new URL(`/downloads/${encodeURIComponent(safeFileName)}`, req.url)
    );
  } catch (error) {
    console.error("API download route error:", error);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}

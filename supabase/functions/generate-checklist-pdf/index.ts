import "https://esm.sh/jspdf@2.5.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Build a simple PDF manually (minimal valid PDF)
  const title = "AI Readiness Checklist";
  const subtitle = "Is Your Business Ready for AI Voice Technology?";
  const sections = [
    {
      heading: "1. Current Phone Operations",
      items: [
        "How many inbound calls does your business receive per day?",
        "What percentage of calls go unanswered or to voicemail?",
        "Do you have after-hours call coverage?",
        "What is your average call-back time for missed calls?",
        "Do you track missed call revenue impact?",
      ],
    },
    {
      heading: "2. Customer Experience",
      items: [
        "How long do callers typically wait on hold?",
        "Do you offer multilingual support?",
        "Can customers book appointments by phone?",
        "Do you send follow-up texts/emails after calls?",
        "How do you handle peak call volumes?",
      ],
    },
    {
      heading: "3. Technology & Integration",
      items: [
        "What CRM or scheduling software do you currently use?",
        "Do you have a website with online booking?",
        "Are your customer records digitized and accessible?",
        "Do you use any automation tools today?",
        "Is your team comfortable adopting new technology?",
      ],
    },
    {
      heading: "4. Business Goals",
      items: [
        "Are you looking to reduce operational costs?",
        "Do you want to extend availability to 24/7?",
        "Is improving customer satisfaction a priority?",
        "Are you planning to scale without adding staff?",
        "Do you want better data and call analytics?",
      ],
    },
    {
      heading: "5. ROI Potential",
      items: [
        "What is your average customer lifetime value?",
        "How much revenue does each missed call potentially cost?",
        "What do you currently spend on receptionist/answering services?",
        "Would capturing 50% more calls significantly impact revenue?",
        "Are you ready to see a personalized ROI calculation?",
      ],
    },
  ];

  const scoring = [
    "0-8 Yes answers: Early Stage — Great time to start exploring AI solutions",
    "9-16 Yes answers: Growing Readiness — You'd benefit significantly from AI voice tech",
    "17-25 Yes answers: Highly Ready — AI voice receptionist could transform your business",
  ];

  // Build minimal PDF content using raw PDF syntax
  // This is a simple text-based PDF
  const nl = "\n";
  let y = 750; // Start from top (PDF coordinates are bottom-up)
  const lineHeight = 14;
  const pageWidth = 612;
  const margin = 50;

  // We'll build the content as a series of text operations
  const lines: string[] = [];
  
  const addLine = (text: string, size: number = 11, bold: boolean = false) => {
    if (y < 60) {
      // Would need pagination - skip for simplicity
      return;
    }
    const font = bold ? "/F2" : "/F1";
    lines.push(`BT ${font} ${size} Tf ${margin} ${y} Td (${escapePdf(text)}) Tj ET`);
    y -= lineHeight;
  };

  const addGap = (gap: number = 8) => {
    y -= gap;
  };

  function escapePdf(str: string): string {
    return str.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  }

  // Title
  lines.push(`BT /F2 22 Tf ${margin} ${y} Td (${escapePdf(title)}) Tj ET`);
  y -= 28;
  lines.push(`BT /F1 13 Tf ${margin} ${y} Td (${escapePdf(subtitle)}) Tj ET`);
  y -= 20;
  lines.push(`BT /F1 10 Tf ${margin} ${y} Td (Brought to you by AI Agents 3000 | aiagents3000.com) Tj ET`);
  y -= 14;

  // Divider line
  lines.push(`${margin} ${y} m ${pageWidth - margin} ${y} l S`);
  y -= 20;

  // Instructions
  addLine("Instructions: Check off each item that applies to your business.", 10);
  addLine("Count your Yes answers to determine your AI readiness score.", 10);
  addGap(12);

  // Sections
  for (const section of sections) {
    addLine(section.heading, 14, true);
    addGap(4);
    for (const item of section.items) {
      lines.push(`BT /F1 11 Tf ${margin} ${y} Td (${escapePdf("☐  " + item)}) Tj ET`);
      y -= lineHeight + 2;
    }
    addGap(10);
  }

  // Scoring
  addGap(4);
  addLine("Your Score", 14, true);
  addGap(4);
  for (const s of scoring) {
    addLine(s, 10);
  }
  addGap(12);
  addLine("Ready to see your personalized results?", 12, true);
  addLine("Visit aiagents3000.com/free-ai-audit for a free comprehensive analysis.", 11);

  // Assemble PDF
  const stream = lines.join(nl);
  const streamLength = new TextEncoder().encode(stream).length;

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj

2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj

3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} 792]
   /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>
endobj

4 0 obj
<< /Length ${streamLength} >>
stream
${stream}
endstream
endobj

5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj

6 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000298 00000 n 
trailer
<< /Size 7 /Root 1 0 R >>
startxref
0
%%EOF`;

  return new Response(pdf, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ai-readiness-checklist.pdf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
});

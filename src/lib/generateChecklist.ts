import jsPDF from "jspdf";

export const generateAIReadinessChecklist = () => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = 50;

  const addLine = (gap = 14) => { y += gap; };

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("AI Readiness Checklist", margin, y);
  addLine(24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("Is Your Business Ready for AI Voice Technology?", margin, y);
  addLine(18);

  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Brought to you by AI Agents 3000  |  aiagents3000.com", margin, y);
  doc.setTextColor(0);
  addLine(12);

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  addLine(16);

  // Instructions
  doc.setFontSize(10);
  doc.text("Instructions: Check off each item that applies. Count your Yes answers for your readiness score.", margin, y);
  addLine(20);

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

  for (const section of sections) {
    // Check if we need a new page
    if (y > 680) {
      doc.addPage();
      y = 50;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(section.heading, margin, y);
    addLine(18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    for (const item of section.items) {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }
      // Checkbox
      doc.rect(margin, y - 9, 10, 10);
      doc.text(item, margin + 18, y);
      addLine(18);
    }
    addLine(10);
  }

  // Scoring section
  if (y > 640) {
    doc.addPage();
    y = 50;
  }

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  addLine(18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Your Readiness Score", margin, y);
  addLine(20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const scores = [
    "0–8 Yes answers:    Early Stage — Great time to start exploring AI solutions",
    "9–16 Yes answers:   Growing Readiness — You'd benefit significantly from AI voice tech",
    "17–25 Yes answers:  Highly Ready — AI voice receptionist could transform your business",
  ];
  for (const s of scores) {
    doc.text(s, margin, y);
    addLine(16);
  }

  addLine(16);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Ready to see your personalized results?", margin, y);
  addLine(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0, 100, 180);
  doc.textWithLink("Visit aiagents3000.com/free-ai-audit for a free comprehensive analysis", margin, y, {
    url: "https://veridian-enterprise.lovable.app/free-ai-audit",
  });
  doc.setTextColor(0);

  doc.save("ai-readiness-checklist.pdf");
};

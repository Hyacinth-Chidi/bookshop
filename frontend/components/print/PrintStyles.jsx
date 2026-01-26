/**
 * ============================================
 * PRINT STYLES COMPONENT
 * ============================================
 * Global print CSS styles for A4, Times New Roman, black & white
 */

export default function PrintStyles() {
  return (
    <style jsx global>{`
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        
        body {
          font-family: 'Times New Roman', Times, serif !important;
          color: black !important;
          color: black !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        /* Force background colors to show when printing */
        .bg-black {
          background-color: black !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .bg-neutral-800 {
          background-color: #262626 !important;
          color: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .bg-gray-100 {
          background-color: #f3f4f6 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        .bg-gray-200 {
          background-color: #e5e7eb !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .page-break-before {
          page-break-before: always;
        }
        
        .page-break-after {
          page-break-after: always;
        }
        
        .avoid-break {
          page-break-inside: avoid;
        }
        
        table {
          border-collapse: collapse;
        }
        
        th, td {
          border-color: black !important;
        }
      }
    `}</style>
  );
}

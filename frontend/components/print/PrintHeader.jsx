/**
 * ============================================
 * PRINT HEADER COMPONENT
 * ============================================
 * Reusable header for print layouts with university branding
 */

import Image from 'next/image';

export default function PrintHeader({ 
  subtitle = 'Student Departmental TextBook List',
  session,
  semester,
  additionalInfo = null,
}) {
  const currentDate = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="border-b-2 border-black pb-4 mb-6">
      <div className="flex items-center gap-6">
        <img
          src="/esut%20logo.png"
          alt="ESUT Logo"
          style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          className="grayscale"
        />
        <div className="flex-1">
          <h1 className="text-xl font-bold uppercase">
            Enugu State University of Science and Technology
          </h1>
          <h2 className="text-lg font-semibold">
            {subtitle}
          </h2>
          <p className="text-sm">
            Session: {session} | Semester: {semester}
          </p>
          {additionalInfo && (
            <p className="text-sm">{additionalInfo}</p>
          )}
          <p className="text-sm">Generated: {currentDate}</p>
        </div>
      </div>
    </div>
  );
}

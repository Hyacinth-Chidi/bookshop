/**
 * ============================================
 * SESSION SEMESTER SELECTOR COMPONENT
 * ============================================
 * Reusable dropdown selectors for session and semester
 */

import Select from '@/components/shared/Select';

export default function SessionSemesterSelector({
  sessionOptions,
  semesterOptions,
  selectedSession,
  selectedSemester,
  onSessionChange,
  onSemesterChange,
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <Select
        label="Session"
        name="session"
        value={selectedSession || ''}
        onChange={(e) => onSessionChange(e.target.value || null)}
        options={sessionOptions}
        disabled={disabled}
      />
      <Select
        label="Semester"
        name="semester"
        value={selectedSemester || ''}
        onChange={(e) => onSemesterChange(e.target.value || null)}
        options={semesterOptions}
        disabled={disabled}
      />
    </div>
  );
}

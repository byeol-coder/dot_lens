import type { AttendanceRecord, AttendanceStatus, Member } from '../types';
import { attendanceRate } from './attendance';
import { monthKey } from './storage';

const statuses: AttendanceStatus[] = ['present', 'late', 'absent', 'excused', 'trial'];

const csvEscape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export function buildMonthlyAttendanceCsv(members: Member[], records: AttendanceRecord[], month: string) {
  const header = ['name', 'jerseyNumber', 'totalSessions', 'present', 'late', 'absent', 'excused', 'trial', 'attendanceRate'];
  const rows = members.map((member) => {
    const memberRecords = records.filter((record) => record.memberId === member.id && monthKey(record.date) === month);
    const counts = statuses.reduce((acc, status) => {
      acc[status] = memberRecords.filter((record) => record.status === status).length;
      return acc;
    }, {} as Record<AttendanceStatus, number>);

    return [
      member.name,
      member.jerseyNumber,
      memberRecords.length,
      counts.present,
      counts.late,
      counts.absent,
      counts.excused,
      counts.trial,
      `${attendanceRate(member.id, records, month)}%`,
    ];
  });

  return [header, ...rows].map((row) => row.map(csvEscape).join(',')).join('\n');
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

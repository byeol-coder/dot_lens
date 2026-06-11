import type { AttendanceRecord, AttendanceStatus, Member } from '../types';
import { monthKey, todayISO } from './storage';

export const statusLabels: Record<AttendanceStatus, string> = {
  present: '출석', late: '지각', absent: '결석', excused: '사유', trial: '체험',
};

export const statusClasses: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-400 text-navy', late: 'bg-amber-300 text-navy', absent: 'bg-rose-400 text-white', excused: 'bg-sky-300 text-navy', trial: 'bg-fuchsia-300 text-navy',
};

export function getTodayRecords(records: AttendanceRecord[], date = todayISO(), location?: string) {
  return records.filter((r) => r.date === date && (!location || r.location === location));
}

export function countByStatus(records: AttendanceRecord[]) {
  return records.reduce((acc, record) => {
    acc[record.status] += 1;
    return acc;
  }, { present: 0, late: 0, absent: 0, excused: 0, trial: 0 } as Record<AttendanceStatus, number>);
}

export function attendanceRate(memberId: string, records: AttendanceRecord[], month?: string) {
  const scoped = records.filter((r) => r.memberId === memberId && (!month || monthKey(r.date) === month));
  if (!scoped.length) return 0;
  const good = scoped.filter((r) => r.status === 'present' || r.status === 'late' || r.status === 'trial').length;
  return Math.round((good / scoped.length) * 100);
}

export function memberName(memberId: string, members: Member[]) {
  return members.find((m) => m.id === memberId)?.name ?? '알 수 없음';
}

import { useMemo, useState } from 'react';
import type { AttendanceRecord, Member, MemberStatus } from '../types';
import { attendanceRate, memberName, statusLabels } from '../utils/attendance';
import { monthKey, todayISO } from '../utils/storage';
import { ProgressBar } from '../components/ProgressBar';
import { buildMonthlyAttendanceCsv, downloadCsv } from '../utils/exportCsv';

const statusFilterOptions: Array<MemberStatus | 'all'> = ['all', 'active', 'new', 'resting', 'left'];
const statusFilterLabels: Record<MemberStatus | 'all', string> = { all: '전체', active: '활동', new: '신규', resting: '휴식', left: '탈퇴' };
const positionOptions = ['all', 'GK', 'DF', 'MF', 'FW', 'Trial'];

type SortMode = 'rateAsc' | 'rateDesc' | 'nameAsc';

export function Stats({ members, records }: { members: Member[]; records: AttendanceRecord[] }) {
  const [selectedMonth, setSelectedMonth] = useState(monthKey(todayISO()));
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('rateAsc');

  const monthRecords = records.filter((r) => monthKey(r.date) === selectedMonth);
  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery = !normalized || member.name.toLowerCase().includes(normalized) || member.nickname.toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesPosition = positionFilter === 'all' || member.position === positionFilter;
      return matchesQuery && matchesStatus && matchesPosition;
    });
  }, [members, positionFilter, query, statusFilter]);

  const ranked = useMemo(() => filteredMembers.map((m) => ({ member: m, rate: attendanceRate(m.id, records, selectedMonth) })).sort((a, b) => {
    if (sortMode === 'rateDesc') return b.rate - a.rate;
    if (sortMode === 'nameAsc') return a.member.name.localeCompare(b.member.name, 'ko');
    return a.rate - b.rate;
  }), [filteredMembers, records, selectedMonth, sortMode]);

  const recentAbsences = records.filter((r) => r.status === 'absent').slice(0, 8);
  const low = ranked.filter((r) => r.rate > 0 && r.rate < 60);
  const exportCsv = () => downloadCsv(`deaf-spirit-fc-attendance-${selectedMonth}.csv`, buildMonthlyAttendanceCsv(filteredMembers, records, selectedMonth));

  return <section className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-2xl font-black text-white">Statistics</h2><p className="text-white/65">월별 출석 요약과 개인별 출석률을 확인합니다.</p></div><button type="button" onClick={exportCsv} className="rounded-2xl bg-spiritSky px-4 py-3 font-black text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" aria-label="월간 출석 CSV 내보내기">CSV Export</button></div>
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4" aria-label="통계 필터">
      <div className="grid gap-3 md:grid-cols-5">
        <label className="text-sm font-bold text-white">월 선택<input aria-label="통계 월 선택" type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
        <label className="text-sm font-bold text-white">검색<input aria-label="이름 또는 닉네임으로 통계 검색" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="이름/닉네임" className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
        <label className="text-sm font-bold text-white">상태<select aria-label="통계 상태 필터" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">{statusFilterOptions.map((status) => <option key={status} value={status}>{statusFilterLabels[status]}</option>)}</select></label>
        <label className="text-sm font-bold text-white">포지션<select aria-label="통계 포지션 필터" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">{positionOptions.map((position) => <option key={position} value={position}>{position === 'all' ? '전체' : position}</option>)}</select></label>
        <label className="text-sm font-bold text-white">정렬<select aria-label="출석률 정렬" value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky"><option value="rateAsc">출석률 낮은 순</option><option value="rateDesc">출석률 높은 순</option><option value="nameAsc">이름순</option></select></label>
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-3xl bg-white/[0.07] p-4"><p className="text-sm font-bold text-white/65">이번 달 기록</p><p className="mt-1 text-3xl font-black text-white">{monthRecords.length}</p></div><div className="rounded-3xl bg-white/[0.07] p-4"><p className="text-sm font-bold text-white/65">최근 결석 기록</p><p className="mt-1 text-3xl font-black text-white">{recentAbsences.length}</p></div><div className="rounded-3xl bg-white/[0.07] p-4"><p className="text-sm font-bold text-white/65">저조 멤버</p><p className="mt-1 text-3xl font-black text-white">{low.length}</p></div></div>
    <div className="rounded-3xl bg-white/[0.07] p-4"><h3 className="text-lg font-black text-white">개인별 월간 출석률</h3><div className="mt-4 space-y-4">{ranked.length === 0 ? <p className="rounded-2xl bg-white/10 p-5 text-center text-white/70">조건에 맞는 멤버가 없습니다. 필터를 변경해보세요.</p> : ranked.map(({ member, rate }) => <div key={member.id}><div className="mb-2 flex justify-between text-sm font-bold text-white"><span>{member.name} #{member.jerseyNumber}</span><span>{rate}%</span></div><ProgressBar value={rate} /></div>)}</div></div>
    <div className="grid gap-4 lg:grid-cols-2"><div className="rounded-3xl bg-white/[0.07] p-4"><h3 className="text-lg font-black text-white">최근 결석 리스트</h3>{recentAbsences.length === 0 ? <p className="mt-3 rounded-2xl bg-white/10 p-5 text-center text-white/60">최근 결석 기록이 없습니다.</p> : <div className="mt-3 space-y-2">{recentAbsences.map((r) => <div key={r.id} className="rounded-2xl bg-white/10 p-3 text-white"><b>{memberName(r.memberId, members)}</b><p className="text-sm text-white/65">{r.date} · {r.location} · {statusLabels[r.status]}</p></div>)}</div>}</div><div className="rounded-3xl bg-white/[0.07] p-4"><h3 className="text-lg font-black text-white">출석률 낮은 멤버</h3>{low.length === 0 ? <p className="mt-3 rounded-2xl bg-white/10 p-5 text-center text-white/60">현재 저조 멤버가 없습니다.</p> : <div className="mt-3 space-y-2">{low.map(({ member, rate }) => <div key={member.id} className="rounded-2xl bg-white/10 p-3 text-white"><b>{member.name}</b><p className="text-sm text-white/65">{selectedMonth} 출석률 {rate}%</p></div>)}</div>}</div></div>
  </section>;
}

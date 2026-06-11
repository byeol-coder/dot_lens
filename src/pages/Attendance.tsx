import { useMemo, useState } from 'react';
import { MemberForm } from '../components/MemberForm';
import type { AttendanceRecord, AttendanceStatus, Member, SessionLocation } from '../types';
import { countByStatus, statusClasses, statusLabels } from '../utils/attendance';
import { todayISO, uid } from '../utils/storage';

const locations: SessionLocation[] = ['동작구 노들구장', '신사 풋살장', '광명 풋살장', '기타', '대회', '연습'];
const statuses: AttendanceStatus[] = ['present', 'late', 'absent', 'excused', 'trial'];
const nextStatus: Record<AttendanceStatus | 'none', AttendanceStatus> = { none: 'present', present: 'late', late: 'absent', absent: 'excused', excused: 'trial', trial: 'present' };

export function Attendance({ members, setMembers, records, setRecords, toast }: { members: Member[]; setMembers: React.Dispatch<React.SetStateAction<Member[]>>; records: AttendanceRecord[]; setRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>; toast: (m: string) => void }) {
  const [date, setDate] = useState(todayISO());
  const [location, setLocation] = useState<SessionLocation>('동작구 노들구장');
  const [showTrial, setShowTrial] = useState(false);
  const sessionRecords = useMemo(() => records.filter((r) => r.date === date && r.location === location), [records, date, location]);
  const counts = countByStatus(sessionRecords);
  const activeMembers = members.filter((m) => m.status !== 'left' && m.status !== 'resting');
  const completion = activeMembers.length ? Math.round((sessionRecords.length / activeMembers.length) * 100) : 0;

  const setStatus = (member: Member, status: AttendanceStatus) => {
    const now = new Date().toISOString();
    setRecords((prev) => {
      const exists = prev.find((r) => r.memberId === member.id && r.date === date && r.location === location);
      if (exists) return prev.map((r) => r.id === exists.id ? { ...r, status, updatedAt: now } : r);
      return [{ id: uid('a'), memberId: member.id, date, location, status, createdAt: now, updatedAt: now }, ...prev];
    });
    toast(`${member.name} · ${statusLabels[status]} 저장`);
  };

  const current = (id: string) => sessionRecords.find((r) => r.memberId === id)?.status;
  const cycleStatus = (member: Member) => setStatus(member, nextStatus[current(member.id) ?? 'none']);
  const addTrial = (member: Member) => { setMembers((prev) => [member, ...prev]); setShowTrial(false); setStatus(member, 'trial'); toast('체험 멤버가 추가되고 출석 처리되었습니다.'); };

  return <section className="space-y-5">
    <div><h2 className="text-2xl font-black text-white">Attendance Check</h2><p className="text-white/65">카드를 한 번 누르면 출석 → 지각 → 결석 → 사유 → 체험 순서로 빠르게 변경됩니다.</p></div>
    <div className="rounded-3xl bg-white/[0.07] p-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-sm font-bold text-white">날짜<input aria-label="출석 날짜" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label><label className="text-sm font-bold text-white">장소<select aria-label="세션 장소" value={location} onChange={(e) => setLocation(e.target.value as SessionLocation)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">{locations.map((l) => <option key={l}>{l}</option>)}</select></label></div></div>
    <div className="sticky top-28 z-30 rounded-3xl border border-white/10 bg-deepnavy/95 p-3 backdrop-blur" aria-live="polite" aria-label="실시간 출석 요약">
      <div className="mb-3 flex items-center justify-between gap-3"><p className="font-black text-white">{date} · {location}</p><p className="rounded-full bg-white px-3 py-1 text-sm font-black text-navy">완료 {completion}%</p></div>
      <div className="grid grid-cols-5 gap-2">{statuses.map((s) => <div key={s} className="text-center"><p className={`rounded-2xl px-2 py-2 text-xs font-black ${statusClasses[s]}`}>{statusLabels[s]}</p><p className="mt-1 text-xl font-black text-white">{counts[s]}</p></div>)}</div>
    </div>
    <button type="button" onClick={() => setShowTrial(true)} className="w-full rounded-3xl bg-gradient-to-r from-spiritPurple to-spiritPink px-5 py-5 text-lg font-black text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" aria-label="현장 체험 멤버 빠른 추가">+ 현장 체험 멤버 빠른 추가</button>
    {showTrial && <MemberForm quickTrial onSave={addTrial} onCancel={() => setShowTrial(false)} />}
    {activeMembers.length === 0 ? <div className="rounded-3xl bg-white/[0.07] p-8 text-center text-white/70"><b className="block text-lg text-white">출석 체크할 활동 멤버가 없습니다.</b><span className="mt-2 block">멤버 화면에서 활동 멤버를 추가하거나 휴식 상태를 변경하세요.</span></div> : <div className="grid gap-4 md:grid-cols-2">{activeMembers.map((m) => {
      const selected = current(m.id);
      return <article key={m.id} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4"><button type="button" onClick={() => cycleStatus(m)} className="flex w-full gap-4 rounded-3xl text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-spiritSky" aria-label={`${m.name} 현재 상태 ${selected ? statusLabels[selected] : '미체크'}, 한 번 눌러 다음 상태로 변경`}><img src={m.profileImage} alt={`${m.name} 프로필`} className="h-28 w-28 rounded-3xl object-cover ring-2 ring-white/20" /><div className="flex-1"><h3 className="text-xl font-black text-white">{m.name}</h3><p className="text-white/70">{m.nickname} · #{m.jerseyNumber} · {m.position}</p>{selected ? <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-black ${statusClasses[selected]}`}>{statusLabels[selected]}</span> : <span className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white">미체크</span>}<p className="mt-2 text-xs font-bold text-white/50">카드 탭: 다음 상태로 변경</p></div></button><div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{statuses.map((s) => <button key={s} type="button" onClick={() => setStatus(m, s)} aria-label={`${m.name} ${statusLabels[s]} 처리`} className={`rounded-2xl px-3 py-4 font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky ${selected === s ? statusClasses[s] : 'bg-white/10 text-white hover:bg-white/20'}`}>{statusLabels[s]}</button>)}</div></article>;
    })}</div>}
  </section>;
}

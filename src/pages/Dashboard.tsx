import type { AttendanceRecord, Member } from '../types';
import { countByStatus, getTodayRecords } from '../utils/attendance';
import { todayISO } from '../utils/storage';
import { ProgressBar } from '../components/ProgressBar';

type Page = 'dashboard' | 'members' | 'attendance' | 'stats';
export function Dashboard({ members, records, setPage }: { members: Member[]; records: AttendanceRecord[]; setPage: (p: Page) => void }) {
  const todayRecords = getTodayRecords(records);
  const counts = countByStatus(todayRecords);
  const complete = members.length ? Math.round((todayRecords.length / members.length) * 100) : 0;
  const stat = [ ['전체 멤버', members.length], ['출석', counts.present], ['지각', counts.late], ['결석', counts.absent], ['사유', counts.excused], ['체험', counts.trial] ];
  return <section className="space-y-5">
    <div className="rounded-[2rem] bg-gradient-to-br from-spiritPurple/80 via-spiritPink/70 to-spiritSky/70 p-[1px]"><div className="rounded-[2rem] bg-navy p-5">
      <p className="text-sm font-bold text-spiritSky">오늘 세션</p><h2 className="mt-1 text-3xl font-black text-white">{todayISO()}</h2><p className="mt-2 text-white/70">훈련장에서도 빠르게 얼굴을 보고 출석 상태를 누를 수 있습니다.</p>
      <div className="mt-5"><div className="mb-2 flex justify-between text-sm font-bold text-white"><span>출석 체크 완료율</span><span>{complete}%</span></div><ProgressBar value={complete} /></div>
    </div></div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{stat.map(([label, value]) => <div key={label} className="rounded-3xl bg-white/[0.07] p-4"><p className="text-sm font-bold text-white/65">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></div>)}</div>
    <div className="grid gap-3 sm:grid-cols-3"><button onClick={() => setPage('attendance')} className="rounded-3xl bg-spiritSky px-5 py-5 text-lg font-black text-navy">Start Attendance</button><button onClick={() => setPage('members')} className="rounded-3xl bg-spiritPink px-5 py-5 text-lg font-black text-white">Add Member</button><button onClick={() => setPage('stats')} className="rounded-3xl bg-spiritPurple px-5 py-5 text-lg font-black text-white">View Stats</button></div>
  </section>;
}

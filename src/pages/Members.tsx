import { useMemo, useState } from 'react';
import type { Member, MemberStatus } from '../types';
import { MemberCard } from '../components/MemberCard';
import { MemberForm } from '../components/MemberForm';
import { ConfirmModal } from '../components/ConfirmModal';

const statusOptions: Array<MemberStatus | 'all'> = ['all', 'active', 'new', 'resting', 'left'];
const statusLabels: Record<MemberStatus | 'all', string> = { all: '전체', active: '활동', new: '신규', resting: '휴식', left: '탈퇴' };
const positionOptions = ['all', 'GK', 'DF', 'MF', 'FW', 'Trial'];

export function Members({ members, setMembers, toast }: { members: Member[]; setMembers: React.Dispatch<React.SetStateAction<Member[]>>; toast: (m: string) => void }) {
  const [editing, setEditing] = useState<Member | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Member | null>(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [positionFilter, setPositionFilter] = useState('all');

  const save = (member: Member) => {
    setMembers((prev) => prev.some((m) => m.id === member.id) ? prev.map((m) => m.id === member.id ? member : m) : [member, ...prev]);
    setEditing(null);
    setShowForm(false);
    toast('멤버 정보가 저장되었습니다.');
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    setMembers((prev) => prev.filter((m) => m.id !== pendingDelete.id));
    toast(`${pendingDelete.name} 멤버가 삭제되었습니다.`);
    setPendingDelete(null);
  };

  const filteredMembers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchesQuery = !normalized || member.name.toLowerCase().includes(normalized) || member.nickname.toLowerCase().includes(normalized);
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesPosition = positionFilter === 'all' || member.position === positionFilter;
      return matchesQuery && matchesStatus && matchesPosition;
    });
  }, [members, positionFilter, query, statusFilter]);

  const trialMembers = members.filter((m) => m.status === 'new' || m.position === 'Trial');

  return <section className="space-y-5">
    <div className="flex items-center justify-between gap-3"><div><h2 className="text-2xl font-black text-white">Member Management</h2><p className="text-white/65">얼굴 사진, 등번호, 포지션을 한눈에 확인합니다.</p></div><button type="button" onClick={() => setShowForm(true)} className="rounded-2xl bg-spiritSky px-4 py-3 font-black text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" aria-label="새 멤버 추가">Add Member</button></div>
    {(showForm || editing) && <MemberForm initial={editing ?? undefined} onSave={save} onCancel={() => { setEditing(null); setShowForm(false); }} />}
    <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-4" aria-label="멤버 필터">
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-sm font-bold text-white">이름/닉네임 검색<input aria-label="이름 또는 닉네임으로 검색" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="예: 샛별, 희정쓰" className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
        <label className="text-sm font-bold text-white">상태 필터<select aria-label="상태 필터" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as MemberStatus | 'all')} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">{statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
        <label className="text-sm font-bold text-white">포지션 필터<select aria-label="포지션 필터" value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">{positionOptions.map((position) => <option key={position} value={position}>{position === 'all' ? '전체' : position}</option>)}</select></label>
      </div>
      <p className="mt-3 text-sm font-bold text-white/65">표시 중: {filteredMembers.length}명 / 전체 {members.length}명</p>
    </div>
    {trialMembers.length > 0 && <div className="rounded-3xl border border-spiritPink/30 bg-spiritPink/10 p-4"><h3 className="font-black text-white">체험 / 신규 멤버</h3><p className="mt-1 text-sm text-white/70">{trialMembers.map((m) => m.name).join(', ')}</p></div>}
    {members.length === 0 ? <div className="rounded-3xl bg-white/[0.07] p-8 text-center text-white/70"><b className="block text-lg text-white">아직 등록된 멤버가 없습니다.</b><span className="mt-2 block">Add Member 버튼으로 첫 멤버를 추가하세요.</span></div> : filteredMembers.length === 0 ? <div className="rounded-3xl bg-white/[0.07] p-8 text-center text-white/70"><b className="block text-lg text-white">검색 결과가 없습니다.</b><span className="mt-2 block">검색어 또는 필터를 조금 넓혀보세요.</span></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredMembers.map((m) => <MemberCard key={m.id} member={m} onEdit={setEditing} onDelete={setPendingDelete} />)}</div>}
    {pendingDelete && <ConfirmModal title="멤버 삭제" message={`${pendingDelete.name} 멤버 정보를 삭제할까요? 삭제 후에는 이 화면에서 복구할 수 없습니다.`} confirmLabel="삭제" onConfirm={confirmDelete} onCancel={() => setPendingDelete(null)} />}
  </section>;
}

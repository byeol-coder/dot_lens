import type { Member } from '../types';

export function MemberCard({ member, onEdit, onDelete }: { member: Member; onEdit: (m: Member) => void; onDelete: (m: Member) => void }) {
  const statusMap = { active: '활동', new: '신규', resting: '휴식', left: '탈퇴' } as const;
  return <article className="rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-glow">
    <div className="flex gap-4">
      <img src={member.profileImage} alt={`${member.name} 프로필`} className="h-24 w-24 rounded-3xl object-cover ring-2 ring-white/20" />
      <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div><h3 className="text-lg font-black text-white">{member.name}</h3><p className="text-sm text-white/70">{member.nickname} · #{member.jerseyNumber}</p></div><span className="rounded-full bg-spiritSky px-3 py-1 text-xs font-black text-navy">{statusMap[member.status]}</span></div><p className="mt-2 text-sm font-bold text-spiritPink">{member.position}</p><p className="mt-1 line-clamp-2 text-sm text-white/70">{member.memo || '메모 없음'}</p></div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => onEdit(member)} aria-label={`${member.name} 정보 수정`} className="rounded-2xl bg-white px-4 py-3 font-black text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">수정</button><button type="button" onClick={() => onDelete(member)} aria-label={`${member.name} 삭제`} className="rounded-2xl bg-rose-500 px-4 py-3 font-black text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">삭제</button></div>
  </article>;
}

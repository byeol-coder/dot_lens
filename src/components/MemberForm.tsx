import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Member, MemberStatus } from '../types';
import { uid, todayISO } from '../utils/storage';

const blank = (): Member => ({ id: uid('m'), name: '', nickname: '', jerseyNumber: '', position: 'MF', profileImage: '', phone: '', joinDate: todayISO(), status: 'new', memo: '' });
const fallbackImage = (name: string) => `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || 'DSFC')}&backgroundColor=7c3aed,ec4899,38bdf8&radius=18`;

export function MemberForm({ initial, onSave, onCancel, quickTrial = false }: { initial?: Member; onSave: (m: Member) => void; onCancel: () => void; quickTrial?: boolean }) {
  const [form, setForm] = useState<Member>(initial ?? { ...blank(), status: quickTrial ? 'new' : 'active', position: quickTrial ? 'Trial' : 'MF' });
  const previewImage = form.profileImage || fallbackImage(form.name);
  const set = (key: keyof Member, value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ ...form, profileImage: form.profileImage || fallbackImage(form.name), firstAttendanceDate: quickTrial ? todayISO() : form.firstAttendanceDate });
  };
  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set('profileImage', String(reader.result));
    reader.readAsDataURL(file);
  };

  return <form onSubmit={submit} className="rounded-3xl border border-white/10 bg-white/[0.07] p-4" aria-label={initial ? '멤버 수정 양식' : '새 멤버 추가 양식'}>
    <h2 className="text-xl font-black text-white">{initial ? '멤버 수정' : quickTrial ? '체험 멤버 빠른 추가' : '새 멤버 추가'}</h2>
    <div className="mt-4 flex items-center gap-4 rounded-3xl bg-white/10 p-3">
      <img src={previewImage} alt="프로필 이미지 미리보기" className="h-24 w-24 rounded-3xl object-cover ring-2 ring-white/20" />
      <div className="flex-1"><p className="text-sm font-bold text-white">프로필 사진 미리보기</p><p className="mt-1 text-xs text-white/60">현장에서 얼굴을 알아보기 쉽도록 정면 사진을 권장합니다.</p></div>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <label className="text-sm font-bold text-white">이름<input required aria-label="이름" value={form.name} onChange={(e) => set('name', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white">닉네임<input aria-label="닉네임" value={form.nickname} onChange={(e) => set('nickname', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white">등번호<input aria-label="등번호" value={form.jerseyNumber} onChange={(e) => set('jerseyNumber', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white">포지션<select aria-label="포지션" value={form.position} onChange={(e) => set('position', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky"><option>GK</option><option>DF</option><option>MF</option><option>FW</option><option>Trial</option></select></label>
      <label className="text-sm font-bold text-white">전화번호<input aria-label="전화번호" value={form.phone} onChange={(e) => set('phone', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white">가입일<input aria-label="가입일" type="date" value={form.joinDate} onChange={(e) => set('joinDate', e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white">상태<select aria-label="멤버 상태" value={form.status} onChange={(e) => set('status', e.target.value as MemberStatus)} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky"><option value="active">활동</option><option value="new">신규</option><option value="resting">휴식</option><option value="left">탈퇴</option></select></label>
      <label className="text-sm font-bold text-white">프로필 이미지 업로드<input aria-label="프로필 이미지 파일 업로드" type="file" accept="image/*" onChange={handleImageUpload} className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white file:mr-3 file:rounded-xl file:border-0 file:bg-spiritSky file:px-3 file:py-2 file:font-black file:text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white sm:col-span-2">프로필 이미지 URL<input aria-label="프로필 이미지 URL" value={form.profileImage.startsWith('data:') ? '업로드된 이미지 사용 중' : form.profileImage} onChange={(e) => set('profileImage', e.target.value)} placeholder="비워두면 자동 생성" className="mt-1 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white placeholder:text-white/40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
      <label className="text-sm font-bold text-white sm:col-span-2">메모<textarea aria-label="메모" value={form.memo} onChange={(e) => set('memo', e.target.value)} className="mt-1 min-h-24 w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky" /></label>
    </div>
    <div className="mt-4 flex gap-2"><button type="submit" className="flex-1 rounded-2xl bg-spiritSky px-4 py-4 font-black text-navy focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">저장</button><button type="button" onClick={onCancel} className="flex-1 rounded-2xl bg-white/10 px-4 py-4 font-black text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky">취소</button></div>
  </form>;
}

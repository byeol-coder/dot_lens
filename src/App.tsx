import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { sampleMembers } from './data/sampleMembers';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Attendance } from './pages/Attendance';
import { Stats } from './pages/Stats';
import type { AttendanceRecord, Member } from './types';

type Page = 'dashboard' | 'members' | 'attendance' | 'stats';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [members, setMembers] = useLocalStorage<Member[]>('dsfc.members.2026.v2', sampleMembers);
  const [records, setRecords] = useLocalStorage<AttendanceRecord[]>('dsfc.attendance.2026.v2', []);
  const [toastMessage, setToastMessage] = useState('');
  const toast = (message: string) => setToastMessage(message);
  useEffect(() => { if (!toastMessage) return; const timer = setTimeout(() => setToastMessage(''), 2200); return () => clearTimeout(timer); }, [toastMessage]);
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_36%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_34%),#040b19] text-white">
    <Header page={page} setPage={setPage} />
    <main className="mx-auto max-w-6xl px-4 py-6 pb-24">
      {page === 'dashboard' && <Dashboard members={members} records={records} setPage={setPage} />}
      {page === 'members' && <Members members={members} setMembers={setMembers} toast={toast} />}
      {page === 'attendance' && <Attendance members={members} setMembers={setMembers} records={records} setRecords={setRecords} toast={toast} />}
      {page === 'stats' && <Stats members={members} records={records} />}
    </main>
    <Toast message={toastMessage} />
  </div>;
}

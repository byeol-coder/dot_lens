type Page = 'dashboard' | 'members' | 'attendance' | 'stats';
export function Header({ page, setPage }: { page: Page; setPage: (page: Page) => void }) {
  const tabs: { key: Page; label: string }[] = [
    { key: 'dashboard', label: '홈' }, { key: 'attendance', label: '출석' }, { key: 'members', label: '멤버' }, { key: 'stats', label: '통계' },
  ];
  return <header className="sticky top-0 z-40 border-b border-white/10 bg-deepnavy/95 backdrop-blur">
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-[0.28em] text-spiritSky">Deaf Spirit FC</p><h1 className="text-xl font-black text-white">Attendance Hub</h1></div>
        <div className="rounded-full bg-gradient-to-r from-spiritPurple via-spiritPink to-spiritSky p-[2px]"><div className="rounded-full bg-navy px-3 py-2 text-sm font-bold text-white">가장 나답게</div></div>
      </div>
      <nav className="mt-4 grid grid-cols-4 gap-2" aria-label="주요 메뉴">
        {tabs.map((tab) => <button key={tab.key} onClick={() => setPage(tab.key)} className={`rounded-2xl px-3 py-3 text-sm font-bold transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-spiritSky ${page === tab.key ? 'bg-white text-navy' : 'bg-white/10 text-white hover:bg-white/15'}`} aria-current={page === tab.key ? 'page' : undefined} aria-label={`${tab.label} 화면으로 이동`}>{tab.label}</button>)}
      </nav>
    </div>
  </header>;
}

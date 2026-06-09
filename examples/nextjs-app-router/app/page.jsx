import CalendarClient from './CalendarClient';

export default function Page() {
  return (
    <main style={{ height: '100vh', padding: 20, boxSizing: 'border-box' }}>
      <h1 style={{ margin: '0 0 16px' }}>Next.js App Router example</h1>
      <div style={{ height: 'calc(100% - 48px)' }}>
        <CalendarClient />
      </div>
    </main>
  );
}

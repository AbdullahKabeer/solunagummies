'use client';

import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <nav style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid black' }}>
        <strong>SOLUNA ADMIN (RAW)</strong>
        <span style={{ margin: '0 10px' }}>|</span>
        <Link href="/admin">Data Inspector</Link>
        <span style={{ margin: '0 10px' }}>|</span>
        <Link href="/">Back to Site</Link>
      </nav>
      {children}
    </div>
  );
}

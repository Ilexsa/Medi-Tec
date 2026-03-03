import React from 'react';
import { Sidebar } from './Sidebar';
interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}
export function Layout({ children, onLogout }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>);

}
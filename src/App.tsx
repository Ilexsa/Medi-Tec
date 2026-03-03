import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { Doctors } from './pages/Doctors';
import { Specialties } from './pages/Specialties';
import { Schedules } from './pages/Schedules';
import { BookAppointment } from './pages/BookAppointment';
import { Medications } from './pages/Medications';
import { ExamTypes } from './pages/ExamTypes';
import { BillableItems } from './pages/BillableItems';
import { Billing } from './pages/Billing';
import { MedicalConsult } from './pages/MedicalConsult';
import { MedicalAttention } from './pages/MedicalAttention';
import { Reports } from './pages/Reports';
import { History } from './pages/History';
import { useAuth } from './context/AuthContext';
export function App() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900">
        <div className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <Layout onLogout={logout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/specialties" element={<Specialties />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/exam-types" element={<ExamTypes />} />
          <Route path="/billable-items" element={<BillableItems />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/medical-consult" element={<MedicalConsult />} />
          <Route path="/medical-attention/:id" element={<MedicalAttention />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>);

}
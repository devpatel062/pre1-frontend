import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function AdminPage() {
  const [dashboard, setDashboard] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, resultsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/results')
        ]);
        setDashboard(dashRes.data);
        setRows(resultsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load admin data');
      }
    };

    load();
  }, []);

  if (error) return <p className="p-8 text-red-600">{error}</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {dashboard && (
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded border bg-white p-4">Students: {dashboard.students}</div>
          <div className="rounded border bg-white p-4">Attempts: {dashboard.attempts}</div>
          <div className="rounded border bg-white p-4">Submitted: {dashboard.submitted}</div>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Score</th>
              <th className="px-3 py-2 text-left">Passed</th>
              <th className="px-3 py-2 text-left">Duration (min)</th>
              <th className="px-3 py-2 text-left">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.attemptId} className="border-t">
                <td className="px-3 py-2">{row.studentName}</td>
                <td className="px-3 py-2">{row.studentEmail}</td>
                <td className="px-3 py-2">{row.totalScore}%</td>
                <td className="px-3 py-2">{row.passed ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">{Math.round(row.durationSeconds / 60)}</td>
                <td className="px-3 py-2">{new Date(row.submittedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

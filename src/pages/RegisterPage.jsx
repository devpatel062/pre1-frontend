import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, register } from '../features/auth/authSlice';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearAuthError());
  }, [dispatch, navigate, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(register(form));
    if (!res.error) navigate('/assessment');
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Create Account</h1>
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Password (min 8 chars)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-brand-700 px-4 py-2 text-white">
          {loading ? 'Please wait...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-3 text-sm">
        Already registered?{' '}
        <Link className="text-brand-700" to="/login">
          Login
        </Link>
      </p>
    </div>
  );
}

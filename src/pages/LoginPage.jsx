import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../features/auth/authSlice';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((s) => s.auth);
  const justRegistered = location.state?.registered;

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearAuthError());
  }, [dispatch, navigate, user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(form));
    if (!res.error) navigate('/');
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Login</h1>
      {justRegistered && (
        <p className="mt-2 rounded bg-emerald-50 border border-emerald-300 px-3 py-2 text-sm text-emerald-700">
          Account created successfully! Please log in.
        </p>
      )}
      <form className="mt-4 space-y-3" onSubmit={onSubmit}>
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full rounded border border-slate-300 px-3 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-brand-700 px-4 py-2 text-white">
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </form>
      <p className="mt-3 text-sm">
        Need an account?{' '}
        <Link className="text-brand-700" to="/register">
          Register
        </Link>
      </p>
    </div>
  );
}

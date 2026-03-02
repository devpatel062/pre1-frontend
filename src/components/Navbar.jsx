import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { resetAssessment } from '../features/assessment/assessmentSlice';

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(resetAssessment());
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-brand-700">
          Outcome School Prework
        </Link>

        <div className="flex items-center gap-3 text-sm">
          {user && <span className="text-slate-700">{user.fullName}</span>}
          {user?.role !== 'student' && (
            <Link className="text-brand-700 hover:underline" to="/admin">
              Admin
            </Link>
          )}
          {user ? (
            <button className="rounded bg-slate-900 px-3 py-1 text-white" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <Link className="text-brand-700" to="/login">
                Login
              </Link>
              <Link className="rounded bg-brand-700 px-3 py-1 text-white" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

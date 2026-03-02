import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAttemptStatus } from '../features/assessment/assessmentSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { alreadyAttempted, completedAttemptId } = useSelector((s) => s.assessment);

  useEffect(() => {
    if (user?.role === 'student') {
      dispatch(checkAttemptStatus());
    }
  }, [dispatch, user]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Prospective Student Assessment</h1>
      <p className="mt-3 text-slate-700">
        Create your account, complete the assessment in under 4 hours, and view your instant result.
      </p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold">Assessment Rules</h2>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-700">
          <li>Account registration is required to access the assessment.</li>
          <li>The maximum allowed duration is 4 hours.</li>
          <li>You can use Back to review previous pages before final submission.</li>
          <li>Each account is limited to <strong>one attempt</strong> only.</li>
          <li>The result page shows your full name, 5 core area scores, and completion time.</li>
        </ul>
      </div>

      <div className="mt-6 flex gap-3">
        {!user && (
          <>
            <Link className="rounded bg-brand-700 px-4 py-2 text-white" to="/register">
              Create Account
            </Link>
            <Link className="rounded border border-slate-300 px-4 py-2" to="/login">
              Login
            </Link>
          </>
        )}
        {user?.role === 'student' && !alreadyAttempted && (
          <Link className="rounded bg-brand-700 px-4 py-2 text-white" to="/assessment">
            Start Assessment
          </Link>
        )}
        {user?.role === 'student' && alreadyAttempted && completedAttemptId && (
          <Link className="rounded bg-brand-700 px-4 py-2 text-white" to={`/result/${completedAttemptId}`}>
            View Your Result
          </Link>
        )}
      </div>
    </div>
  );
}

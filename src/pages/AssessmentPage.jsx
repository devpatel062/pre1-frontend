import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimerBadge from '../components/TimerBadge';
import {
  fetchPage,
  saveAnswer,
  startAssessment,
  submitAssessment,
  tick
} from '../features/assessment/assessmentSlice';
import { Link } from 'react-router-dom';

export default function AssessmentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    attemptId,
    page,
    totalPages,
    remainingSeconds,
    question,
    selectedValue,
    loading,
    error,
    alreadyAttempted,
    completedAttemptId
  } = useSelector((s) => s.assessment);

  useEffect(() => {
    let timer;
    if (remainingSeconds > 0) {
      timer = setInterval(() => dispatch(tick()), 1000);
    }
    return () => clearInterval(timer);
  }, [dispatch, remainingSeconds]);

  useEffect(() => {
    const boot = async () => {
      if (!attemptId) {
        const startRes = await dispatch(startAssessment());
        if (!startRes.error) {
           // Start with page 1
           dispatch(fetchPage({ attemptId: startRes.payload.attemptId, page: 1 }));
        } else if (startRes.payload?.alreadyAttempted && startRes.payload?.attemptId) {
          navigate(`/result/${startRes.payload.attemptId}`);
        }
      }
    };
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount to boot up

  // We remove the reactive fetching based on 'page' state
  // Page changes should be driven by explicit user actions (goToPage)


  useEffect(() => {
    if (remainingSeconds === 0 && attemptId) {
      dispatch(submitAssessment({ attemptId })).then((res) => {
        if (!res.error) navigate(`/result/${attemptId}`);
      });
    }
  }, [attemptId, dispatch, navigate, remainingSeconds]);

  const handleSelect = (value) => {
    if (!question) return;
    dispatch(saveAnswer({ attemptId, questionId: question._id, selectedValue: value }));
  };

  const goToPage = async (targetPage) => {
    if (!attemptId) return;
    await dispatch(fetchPage({ attemptId, page: targetPage }));
  };

  const onSubmit = async () => {
    const ok = window.confirm('Final submit? You will not be able to edit answers after submission.');
    if (!ok) return;

    const res = await dispatch(submitAssessment({ attemptId }));
    if (!res.error) {
      navigate(`/result/${attemptId}`);
    }
  };

  if (alreadyAttempted) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Assessment Already Completed</h1>
        <p className="mt-3 text-slate-700">
          You have already completed the assessment. Each account is limited to one attempt.
        </p>
        {completedAttemptId && (
          <Link
            to={`/result/${completedAttemptId}`}
            className="mt-5 inline-block rounded bg-brand-700 px-4 py-2 text-white"
          >
            View Your Result
          </Link>
        )}
      </div>
    );
  }

  if (!question && loading) return <p className="p-8">Loading assessment...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Assessment Test</h1>
        <TimerBadge seconds={remainingSeconds} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
          <span>
            Question {page} of {totalPages}
          </span>
          <span>Core Area: {question?.coreArea}</span>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">{question?.prompt}</h2>

        <div className="mt-5 space-y-2">
          {question?.options.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded border p-3 ${
                selectedValue === opt.value ? 'border-brand-600 bg-brand-50' : 'border-slate-200'
              }`}
            >
              <input
                type="radio"
                checked={selectedValue === opt.value}
                onChange={() => handleSelect(opt.value)}
              />
              <span>{opt.text}</span>
            </label>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex items-center justify-between">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="rounded border border-slate-300 px-4 py-2 disabled:opacity-50"
          >
            ← Back
          </button>

          {page < totalPages ? (
            <button
              disabled={selectedValue == null}
              onClick={() => goToPage(page + 1)}
              className="rounded bg-brand-700 px-4 py-2 text-white disabled:opacity-50"
            >
              Next →
            </button>
          ) : (
            <button
              disabled={selectedValue == null}
              onClick={onSubmit}
              className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Final Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

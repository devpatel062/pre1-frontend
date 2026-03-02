import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { fetchResult } from '../features/assessment/assessmentSlice';

export default function ResultPage() {
  const { attemptId } = useParams();
  const dispatch = useDispatch();
  const { result, error } = useSelector((s) => s.assessment);

  useEffect(() => {
    dispatch(fetchResult({ attemptId }));
  }, [attemptId, dispatch]);

  if (!result) {
    return <p className="p-8">{error || 'Loading result...'}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Assessment Result</h1>
        <p className="mt-2 text-slate-700">Student: {result.student.fullName}</p>
        <p className="text-slate-700">Email: {result.student.email}</p>

        <div className="mt-4 rounded bg-slate-50 p-4">
          <p className="text-lg font-semibold">Total Score: {result.totalScore}%</p>
          <p className={`font-medium ${result.passed ? 'text-emerald-700' : 'text-red-700'}`}>
            Status: {result.passed ? 'Passed' : 'Not Passed'}
          </p>
          <p>
            Completion Time: {result.duration.hours} hours {result.duration.minutes} minutes
          </p>
        </div>

        <h2 className="mt-6 text-lg font-semibold">5 Core Area Scores</h2>
        <div className="mt-3 space-y-2">
          {result.areaScores.map((area) => (
            <div key={area.coreArea} className="flex items-center justify-between rounded border p-3">
              <span>{area.coreArea}</span>
              <span className="font-semibold">{area.score}%</span>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Please take a screenshot of this result and include it in your Outcome School admission application and your personal record.
        </p>

        <Link className="mt-5 inline-block rounded bg-brand-700 px-4 py-2 text-white" to="/">
          Go Home
        </Link>
      </div>
    </div>
  );
}

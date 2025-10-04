import { Spinner } from './spinner';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <p className="text-gray-700 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
}

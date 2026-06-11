'use client';

interface Props {
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ type, title, message, onClose }: Props) {
  const isSuccess = type === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'}`}>
          {isSuccess ? (
            <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          )}
        </div>

        <h2 className="mb-1 text-center text-lg font-semibold text-gray-800">{title}</h2>
        <p className="mb-6 text-center text-sm text-gray-500">{message}</p>

        <button
          onClick={onClose}
          className={`w-full rounded-lg py-2.5 text-sm font-medium text-white transition-colors ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}

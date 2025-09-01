export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">📅</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BookingSaaS</span>
          </div>
          <p className="text-gray-600 text-sm">
            Professional booking management platform
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
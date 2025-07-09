function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Pump Master
        </h1>
        <p className="text-center text-gray-600">
          Project setup complete! ✅
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            ✓ React + TypeScript + Vite
          </p>
          <p className="text-sm text-gray-500">
            ✓ Tailwind CSS configured
          </p>
          <p className="text-sm text-gray-500">
            ✓ All dependencies installed
          </p>
          <p className="text-sm text-gray-500">
            ✓ Folder structure created
          </p>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
          Ready to Start!
        </button>
      </div>
    </div>
  );
}

export default App;

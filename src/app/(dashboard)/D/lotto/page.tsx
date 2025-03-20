'use client';

import { useState } from 'react';

interface LottoResult {
  id: string;
  drawTime: string;
  drawDate: string;
  numbers: number[];
  type: 'Fortune 14H' | 'Fortune 18H';
  status: 'pending' | 'completed';
}

export default function LottoPage() {
  const [results, setResults] = useState<LottoResult[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newResult, setNewResult] = useState<Partial<LottoResult>>({
    drawTime: '',
    drawDate: '',
    numbers: [],
    type: 'Fortune 14H',
    status: 'pending',
  });

  const handleNumberInput = (index: number, value: string) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num > 90) return;
    
    const newNumbers = [...(newResult.numbers || [])];
    newNumbers[index] = num;
    setNewResult({ ...newResult, numbers: newNumbers });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add Supabase integration
    const result: LottoResult = {
      id: Date.now().toString(),
      ...newResult as LottoResult,
    };
    setResults([...results, result]);
    setShowAddForm(false);
    setNewResult({
      drawTime: '',
      drawDate: '',
      numbers: [],
      type: 'Fortune 14H',
      status: 'pending',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lotto Results Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Result
        </button>
      </div>

      {/* Add Result Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Result</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Draw Type</label>
                <select
                  value={newResult.type}
                  onChange={(e) => setNewResult({ ...newResult, type: e.target.value as 'Fortune 14H' | 'Fortune 18H' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="Fortune 14H">Fortune 14H</option>
                  <option value="Fortune 18H">Fortune 18H</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Draw Date</label>
                <input
                  type="date"
                  value={newResult.drawDate}
                  onChange={(e) => setNewResult({ ...newResult, drawDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Draw Time</label>
                <input
                  type="time"
                  value={newResult.drawTime}
                  onChange={(e) => setNewResult({ ...newResult, drawTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={newResult.status}
                  onChange={(e) => setNewResult({ ...newResult, status: e.target.value as 'pending' | 'completed' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Winning Numbers</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    type="number"
                    min="1"
                    max="90"
                    value={newResult.numbers?.[index - 1] || ''}
                    onChange={(e) => handleNumberInput(index - 1, e.target.value)}
                    className="w-16 h-16 text-center text-xl border rounded-lg focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Result
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numbers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result) => (
              <tr key={result.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{result.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(result.drawDate).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{result.drawTime}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    {result.numbers.map((num, index) => (
                      <span key={index} className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {num}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    result.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {result.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
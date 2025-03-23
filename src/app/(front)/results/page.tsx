'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/component/NavBar';
import { getLottoResults, LottoResult } from '@/lib/supabase';

export default function Results() {
  const [results, setResults] = useState<LottoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all'
  });
  const [filteredResults, setFilteredResults] = useState<LottoResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getLottoResults();
        setResults(data);
        setFilteredResults(data);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    let filtered = [...results];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(result => new Date(result.draw_date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      filtered = filtered.filter(result => new Date(result.draw_date) <= new Date(filters.endDate));
    }

    // Filter by type
    if (filters.type !== 'all') {
      filtered = filtered.filter(result => result.type === filters.type);
    }

    setFilteredResults(filtered);
  }, [filters, results]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Résultats des tirages</h1>

        {/* Filters Section */}
        <section className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtrer les résultats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de tirage</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="all">Tous les tirages</option>
                <option value="Fortune 14H">Fortune 14H</option>
                <option value="Fortune 18H">Fortune 18H</option>
              </select>
            </div>
          </div>
        </section>

        {/* Latest Results Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Derniers tirages</h2>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.slice(0, 6).map((result) => (
                <div key={result.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium text-green-600">{result.type}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(result.draw_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${result.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                      {result.status === 'completed' ? 'Terminé' : 'En attente'}
                    </span>
                  </div>
                  <div className="flex gap-2 mb-4">
                    {result.numbers.map((number, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-medium"
                      >
                        {number}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    Heure du tirage: {result.draw_time}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Results Archive */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Archives des résultats</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tirage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Heure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéros</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(result.draw_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.type}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{result.draw_time}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {result.numbers.map((number, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-green-600 bg-green-50 rounded"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${result.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                        {result.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
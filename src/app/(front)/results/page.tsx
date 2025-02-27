'use client';
import React from 'react';
import NavBar from '@/component/NavBar';

export default function Results() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Résultats des tirages</h1>
        
        {/* Latest Results Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Derniers tirages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Result Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium text-green-600">Fortune 14H</h3>
                  <p className="text-sm text-gray-500">15 Mars 2024</p>
                </div>
                <span className="text-2xl">🟡</span>
              </div>
              <div className="flex gap-2 mb-4">
                {[12, 45, 67, 89, 90].map((number) => (
                  <div
                    key={number}
                    className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 font-medium"
                  >
                    {number}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Prochain tirage: Aujourd&apos;hui à 18H
              </div>
            </div>
          </div>
        </section>

        {/* Results Calendar */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calendrier des résultats</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-7 gap-4 text-center">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="font-medium text-gray-600">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <button
                  key={i + 1}
                  className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéros</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gagnants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">15 Mars 2024</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Fortune 14H</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {[12, 45, 67, 89, 90].map((number) => (
                          <span
                            key={number}
                            className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-green-600 bg-green-50 rounded"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">150</td>
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
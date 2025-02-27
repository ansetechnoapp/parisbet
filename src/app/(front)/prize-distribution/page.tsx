'use client';
import React from 'react';
import NavBar from '@/component/NavBar';

export default function PrizeDistribution() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Distribution des gains</h1>
        
        {/* Prize Categories */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Catégories de gains</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loto Prizes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">🎲 Loto</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Poto</div>
                    <div className="text-sm text-gray-600">Premier numéro tiré</div>
                  </div>
                  <div className="text-green-600 font-medium">x70</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Tout chaud</div>
                    <div className="text-sm text-gray-600">2 numéros dans les 5 tirés</div>
                  </div>
                  <div className="text-green-600 font-medium">x240</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">3 Nape</div>
                    <div className="text-sm text-gray-600">3 numéros dans les 5 tirés</div>
                  </div>
                  <div className="text-green-600 font-medium">x1000</div>
                </div>
              </div>
            </div>

            {/* Football Betting Prizes */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">⚽ Paris Sportifs</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Paris simple</div>
                    <div className="text-sm text-gray-600">Cote du match x Mise</div>
                  </div>
                  <div className="text-green-600 font-medium">Variable</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Paris combiné</div>
                    <div className="text-sm text-gray-600">Multiplication des cotes</div>
                  </div>
                  <div className="text-green-600 font-medium">Variable</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Prizes are Calculated */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Calcul des gains</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Pour le Loto</h3>
                <p className="text-gray-600">
                  Les gains sont calculés en multipliant votre mise par le multiplicateur de la catégorie gagnante.
                  Par exemple, si vous misez 1000 FCFA sur un Poto et gagnez, vous recevrez 1000 × 70 = 70000 FCFA.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Pour les Paris Sportifs</h3>
                <p className="text-gray-600">
                  Pour un pari simple, vos gains sont calculés en multipliant votre mise par la cote du match.
                  Pour un pari combiné, on multiplie votre mise par le produit des cotes sélectionnées.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Paiement des gains</h2>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-medium text-gray-800 mb-2">Gains instantanés</h3>
                <p className="text-sm text-gray-600">
                  Vos gains sont crédités instantanément sur votre compte après la validation des résultats.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">📱</div>
                <h3 className="font-medium text-gray-800 mb-2">Mobile Money</h3>
                <p className="text-sm text-gray-600">
                  Retirez vos gains via MTN Money ou Moov Money à tout moment.
                </p>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-medium text-gray-800 mb-2">Sans frais</h3>
                <p className="text-sm text-gray-600">
                  Aucun frais n'est prélevé sur vos gains. Vous recevez 100% de vos gains.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/component/NavBar';

export default function HowToPlay() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Comment jouer</h1>
        
        {/* Quick Start Guide */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Guide rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md">
              <div className="text-3xl mb-4">1️⃣</div>
              <h3 className="font-medium text-gray-800 mb-2">Choisissez votre jeu</h3>
              <p className="text-gray-600">
                Sélectionnez entre le Loto ou les Paris Sportifs selon vos préférences.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md">
              <div className="text-3xl mb-4">2️⃣</div>
              <h3 className="font-medium text-gray-800 mb-2">Placez votre pari</h3>
              <p className="text-gray-600">
                Choisissez vos numéros ou vos équipes et définissez votre mise.
              </p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm p-6 transition-shadow hover:shadow-md">
              <div className="text-3xl mb-4">3️⃣</div>
              <h3 className="font-medium text-gray-800 mb-2">Recevez vos gains</h3>
              <p className="text-gray-600">
                Si vous gagnez, les gains sont automatiquement versés sur votre compte.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Detailed Instructions */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Instructions détaillées</h2>
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">🎲 Pour le Loto</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Choisissez une formule de jeu (Simple ou Perm)</li>
                <li>Sélectionnez votre type de pari (Poto, Tout chaud, etc.)</li>
                <li>Entrez vos numéros ou utilisez l&apos;option Flash</li>
                <li>Définissez votre mise (minimum 100 FCFA)</li>
                <li>Validez votre ticket avec votre numéro de téléphone</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">⚽ Pour les Paris Sportifs</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Choisissez votre championnat préféré</li>
                <li>Sélectionnez un ou plusieurs matchs</li>
                <li>Choisissez vos pronostics (1, N, 2)</li>
                <li>Définissez votre mise</li>
                <li>Validez votre pari</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                question: "Comment récupérer mes gains ?",
                answer: "Les gains sont automatiquement crédités sur votre compte mobile money."
              },
              {
                question: "Quel est le montant minimum pour parier ?",
                answer: "Le montant minimum est de 100 FCFA par pari."
              },
              {
                question: "Comment voir mes paris en cours ?",
                answer: "Consultez la section 'Mes tickets' pour voir tous vos paris actifs."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-medium text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
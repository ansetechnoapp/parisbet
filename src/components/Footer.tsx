'use client';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-green-800 to-green-900 text-white py-8 md:py-12 mt-8 md:mt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <a href="#" className="text-sm text-center">À propos</a>
          <a href="#" className="text-sm text-center">Mentions légales</a>
          <a href="#" className="text-sm text-center">Conditions générales</a>
          <a href="#" className="text-sm text-center">Jeu responsable</a>
          <a href="#" className="text-sm text-center">Protection des données</a>
        </div> 

        <div className="flex justify-center mb-6">
          <div className="bg-white text-green-800 px-4 py-2 rounded flex items-center">
            JOUONS RESPONSABLE ✓
          </div>
          <div className="bg-green-700 text-white px-4 py-2 rounded flex items-center ml-2">
            PARIER<br />18 ANS
          </div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <div className="bg-white p-2 rounded">LNB</div>
          <div className="bg-white p-2 rounded">MTN</div>
          <div className="bg-white p-2 rounded">MOOV</div>
          <div className="bg-white p-2 rounded">CELLUL</div>
        </div>

        <div className="flex justify-center space-x-4 mb-6">
          <a href="#" className="text-xl">Facebook</a>
          <a href="#" className="text-xl">Instagram</a>
        </div>

        <div className="text-center text-sm">
          2025 © LNB - Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

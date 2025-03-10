import React from 'react';

const WarningBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white text-xs md:text-sm py-2 md:py-3 px-2 md:px-4 flex justify-center items-center">
      <div className="flex-1 text-center font-medium tracking-wide">
        LES JEUX D&apos;ARGENT ET DE HASARD SONT INTERDITS AUX MINEURS
      </div>
      <button className="rounded-full w-5 h-5 md:w-6 md:h-6 bg-green-700 hover:bg-green-600 transition-colors text-white flex items-center justify-center">
        ×
      </button>
    </div>
  );
};

export default WarningBanner;

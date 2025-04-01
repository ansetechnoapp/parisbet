import React, { useState, useEffect } from 'react';

const WarningBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Check localStorage on component mount to see if the banner was previously closed
  useEffect(() => {
    const bannerClosed = localStorage.getItem('warningBannerClosed');
    if (bannerClosed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Save the user's preference in localStorage
    localStorage.setItem('warningBannerClosed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white text-xs md:text-sm py-2 md:py-3 px-2 md:px-4 flex justify-center items-center">
      <div className="flex-1 text-center font-medium tracking-wide">
        LES JEUX D&apos;ARGENT ET DE HASARD SONT INTERDITS AUX MINEURS
      </div>
      <button
        onClick={handleClose}
        className="rounded-full w-5 h-5 md:w-6 md:h-6 bg-green-700 hover:bg-green-600 transition-colors text-white flex items-center justify-center"
        aria-label="Fermer l'avertissement"
      >
        ×
      </button>
    </div>
  );
};

export default WarningBanner;

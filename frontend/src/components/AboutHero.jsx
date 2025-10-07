import React from 'react';
import { assets } from '../assets/assets'

const AboutHero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center gap-10">
      <img src={assets.about_image} alt="about" className="w-full md:max-w-md rounded-xl shadow-lg" />
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">ABOUT <span className="text-teal-500">US</span></h1>
        <p className="text-gray-600 text-lg">
          Welcome to CareBridge, your trusted partner in managing your healthcare needs conveniently and efficiently.
        </p>
      </div>
    </div>
  );
};

export default AboutHero;

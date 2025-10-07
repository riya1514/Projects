import React from 'react';

const FeatureCard = ({ title, description, icon, gradientColor }) => {
  return (
    <div className={`p-6 rounded-xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition transform duration-300 border-t-4 ${gradientColor ? `bg-gradient-to-tr ${gradientColor} text-white` : ''}`}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default FeatureCard;

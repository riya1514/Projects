import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  return (
    <div className="px-4 sm:px-8 py-6">
      <p className="text-gray-600 mb-4 text-sm sm:text-base">
        Browse through the doctors specialist.
      </p>

      {/* Toggle Filter Button on Mobile */}
      <div className="sm:hidden mb-4">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 rounded text-sm border transition-all ${
            showFilter ? 'bg-primary text-white' : 'bg-white text-gray-800'
          }`}
        >
          Filters
        </button>
      </div>

      {/* Filter Buttons */}
      <div className={`${showFilter ? 'block' : 'hidden sm:block'}`}>
        <div className="w-full overflow-x-auto no-scrollbar">
          <div className="flex gap-3 min-w-max py-2">
            {specialities.map((type) => (
              <button
                key={type}
                onClick={() =>
                  speciality === type
                    ? navigate('/doctors')
                    : navigate(`/doctors/${type}`)
                }
                className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all duration-300 border ${
                  speciality === type
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filterDoc.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-5px] transition-transform duration-300 shadow-sm"
          >
            <img className="w-full h-[280px] object-cover object-top bg-[#EAEFFF]" src={item.image} alt={item.name} />
            <div className="p-4">
              <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                <span className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{item.available ? 'Available' : 'Not Available'}</span>
              </div>
              <p className="text-[#262626] text-lg font-semibold mt-2">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { motion } from 'framer-motion';
import { HeartPulse, Crosshair, MapPin } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const specialities = [
  'General physician',
  'Gynecologist',
  'Dermatologist',
  'Pediatricians',
  'Neurologist',
  'Gastroenterologist',
];

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Hospitals = () => {
  const [location, setLocation] = useState({ lat: 18.5193, lng: 73.8586 });
  const [hospitals, setHospitals] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc = { lat: latitude, lng: longitude };
        setLocation(loc);
        fetchHospitals(loc.lat, loc.lng);
      },
      () => {
        fetchHospitals(location.lat, location.lng);
      }
    );
  }, []);

  const fetchHospitals = async (lat, lon) => {
    const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:3000,${lat},${lon})[amenity=hospital];out;`;
    try {
      const response = await axios.get(overpassUrl);
      const data = response.data.elements.map((el) => {
        const distance = haversineDistance(lat, lon, el.lat, el.lon);
        return {
          id: el.id,
          name: el.tags.name || 'Unnamed Hospital',
          lat: el.lat,
          lon: el.lon,
          distance: distance.toFixed(2),
          speciality: specialities[Math.floor(Math.random() * specialities.length)],
        };
      });
      setHospitals(data);
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
    }
  };

  const RecenterMap = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center]);
    return null;
  };

  const openDirections = (hospital) => {
    const origin = `${location.lat},${location.lng}`;
    const destination = `${hospital.lat},${hospital.lon}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const filteredHospitals =
    selectedSpeciality === 'All'
      ? hospitals
      : hospitals.filter((h) => h.speciality === selectedSpeciality);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-teal-100 rounded-full p-4 mb-4">
            <HeartPulse className="h-8 w-8 text-teal-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Find <span className="text-teal-500">Healthcare</span> Near You
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover nearby hospitals, clinics, and healthcare providers to get the care you need.
          </p>
        </div>

        {/* Location Card */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg rounded-2xl border-none mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center justify-center bg-teal-500 rounded-full p-3 text-white">
              <Crosshair className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Your Location</h3>
              <p className="text-gray-600">
                Showing hospitals near your current location.
              </p>
            </div>
          </div>
        </div>

        {/* Speciality Filter Buttons */}
<div className="mb-10">
  <p className="block text-sm font-medium text-gray-700 mb-2">
    Filter by Speciality:
  </p>
  <div className="w-full overflow-x-auto no-scrollbar">
    <div className="flex gap-3 min-w-max py-2">
      <button
        onClick={() => setSelectedSpeciality('All')}
        className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all duration-300 border ${
          selectedSpeciality === 'All'
            ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-transparent shadow-md'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        }`}
      >
        All
      </button>
      {specialities.map((spec) => (
        <button
          key={spec}
          onClick={() => setSelectedSpeciality(spec)}
          className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-all duration-300 border ${
            selectedSpeciality === spec
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-transparent shadow-md'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          {spec}
        </button>
      ))}
    </div>
  </div>
</div>


        {/* Map */}
        <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl mb-10">
          <MapContainer center={location} zoom={13} className="w-full h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <RecenterMap center={location} />
            <Marker position={location}>
              <Popup>Your Location</Popup>
            </Marker>
            {filteredHospitals.map((hospital) => (
              <Marker key={hospital.id} position={[hospital.lat, hospital.lon]}>
                <Popup>{hospital.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Hospital Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              onClick={() => openDirections(hospital)}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{hospital.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {hospital.distance} km away
                  </p>
                  <p className="text-sm text-teal-600 mt-1">
                    Speciality: {hospital.speciality}
                  </p>
                  <p className="text-xs text-blue-500 mt-2">Click to view directions</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Hospitals;

// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { HeartPulse, Crosshair, MapPin } from 'lucide-react';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const specialities = [
//   'General physician',
//   'Gynecologist',
//   'Dermatologist',
//   'Pediatricians',
//   'Neurologist',
//   'Gastroenterologist',
// ];

// const haversineDistance = (lat1, lon1, lat2, lon2) => {
//   const toRad = (value) => (value * Math.PI) / 180;
//   const R = 6371;
//   const dLat = toRad(lat2 - lat1);
//   const dLon = toRad(lon2 - lon1);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// const NearbyHospitals = () => {
//   const [location, setLocation] = useState({ lat: 18.5193, lng: 73.8586 });
//   const [hospitals, setHospitals] = useState([]);
//   const [selectedSpeciality, setSelectedSpeciality] = useState('All');

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         const loc = { lat: latitude, lng: longitude };
//         setLocation(loc);
//         fetchHospitals(loc.lat, loc.lng);
//       },
//       () => {
//         fetchHospitals(location.lat, location.lng);
//       }
//     );
//   }, []);

//   const fetchHospitals = async (lat, lon) => {
//     const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:3000,${lat},${lon})[amenity=hospital];out;`;
//     try {
//       const response = await axios.get(overpassUrl);
//       const data = response.data.elements.map((el) => {
//         const distance = haversineDistance(lat, lon, el.lat, el.lon);
//         return {
//           id: el.id,
//           name: el.tags.name || 'Unnamed Hospital',
//           lat: el.lat,
//           lon: el.lon,
//           distance: distance.toFixed(2),
//           speciality: specialities[Math.floor(Math.random() * specialities.length)],
//         };
//       });
//       setHospitals(data);
//     } catch (error) {
//       console.error('Failed to fetch hospitals:', error);
//     }
//   };

//   const RecenterMap = ({ center }) => {
//     const map = useMap();
//     useEffect(() => {
//       map.setView(center);
//     }, [center]);
//     return null;
//   };

//   const openDirections = (hospital) => {
//     const origin = `${location.lat},${location.lng}`;
//     const destination = `${hospital.lat},${hospital.lon}`;
//     const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
//     window.open(url, '_blank');
//   };

//   const filteredHospitals =
//     selectedSpeciality === 'All'
//       ? hospitals
//       : hospitals.filter((h) => h.speciality === selectedSpeciality);

//   return (
//     <div className="container mx-auto px-4 py-12 max-w-6xl">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-12"
//       >
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center bg-teal-100 rounded-full p-4 mb-4">
//             <HeartPulse className="h-8 w-8 text-teal-600" />
//           </div>
//           <h1 className="text-4xl font-bold tracking-tight mb-3">
//             Find <span className="text-teal-500">Healthcare</span> Near You
//           </h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Discover nearby hospitals, clinics, and healthcare providers to get the care you need.
//           </p>
//         </div>

//         {/* Location Card */}
//         <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-lg rounded-2xl border-none mb-6">
//           <div className="flex flex-col md:flex-row items-center gap-4">
//             <div className="flex items-center justify-center bg-teal-500 rounded-full p-3 text-white">
//               <Crosshair className="h-5 w-5" />
//             </div>
//             <div>
//               <h3 className="font-semibold text-lg">Your Location</h3>
//               <p className="text-gray-600">
//                 Showing hospitals near your current location.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Speciality Filter */}
//         <div className="mb-10">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Filter by Speciality:
//           </label>
//           <select
//             value={selectedSpeciality}
//             onChange={(e) => setSelectedSpeciality(e.target.value)}
//             className="block w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
//           >
//             <option value="All">All</option>
//             {specialities.map((spec, i) => (
//               <option key={i} value={spec}>
//                 {spec}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Map */}
//         <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-xl mb-10">
//           <MapContainer center={location} zoom={13} className="w-full h-full">
//             <TileLayer
//               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               attribution="&copy; OpenStreetMap contributors"
//             />
//             <RecenterMap center={location} />
//             <Marker position={location}>
//               <Popup>Your Location</Popup>
//             </Marker>
//             {filteredHospitals.map((hospital) => (
//               <Marker key={hospital.id} position={[hospital.lat, hospital.lon]}>
//                 <Popup>{hospital.name}</Popup>
//               </Marker>
//             ))}
//           </MapContainer>
//         </div>

//         {/* Hospital Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredHospitals.map((hospital, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ y: -5 }}
//               onClick={() => openDirections(hospital)}
//               className="bg-white p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer hover:shadow-lg transition"
//             >
//               <div className="flex items-start gap-4">
//                 <div className="bg-rose-100 p-3 rounded-full">
//                   <MapPin className="h-5 w-5 text-rose-600" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-lg">{hospital.name}</h3>
//                   <p className="text-gray-600 text-sm mt-1">
//                     📍 {hospital.distance} km away
//                   </p>
//                   <p className="text-sm text-teal-600 mt-1">
//                     Speciality: {hospital.speciality}
//                   </p>
//                   <p className="text-xs text-blue-500 mt-2">Click to view directions</p>
//                 </div>
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default NearbyHospitals;



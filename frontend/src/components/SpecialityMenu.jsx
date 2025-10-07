// // SpecialityMenu.js
// import React from 'react'
// import { specialityData } from '../assets/assets'
// import { Link } from 'react-router-dom'

// const SpecialityMenu = () => {
//     return (
//         <section id="speciality" className="py-16">
//             <div className="text-center max-w-2xl mx-auto mb-12">
//                 <h2 className="text-3xl font-bold text-gray-800 mb-3">Medical Specialties</h2>
//                 <p className="text-gray-600">
//                     Comprehensive care across all major medical disciplines from our network of specialists.
//                 </p>
//             </div>
//             <div className="flex overflow-x-auto pb-4 -mx-2 px-2 hide-scrollbar">
//                 <div className="flex space-x-6 px-2">
//                     {specialityData.map((item, index) => (
//                         <Link 
//                             to={`/doctors/${item.speciality}`} 
//                             onClick={() => window.scrollTo(0, 0)}
//                             className="flex flex-col items-center w-24 flex-shrink-0 group" 
//                             key={index}
//                         >
//                             <div className="bg-white p-4 rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300 mb-3">
//                                 <img className="w-10 h-10 object-contain" src={item.image} alt={item.speciality} />
//                             </div>
//                             <span className="text-sm font-medium text-gray-700 text-center">
//                                 {item.speciality}
//                             </span>
//                         </Link>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default SpecialityMenu




import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='flex flex-col items-center gap-4 py-16 text-[#262626]'>
            <h1 className='text-3xl font-medium'>Find by Speciality</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll '>
                {specialityData.map((item, index) => (
                    <Link to={`/doctors/${item.speciality}`} onClick={() => scrollTo(0, 0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index}>
                        <img className='w-16 sm:w-24 mb-2 ' src={item.image} alt="" />
                        <p>{item.speciality}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default SpecialityMenu
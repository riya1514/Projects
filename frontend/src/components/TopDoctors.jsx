// TopDoctors.js
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <section className="py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Featured Specialists</h2>
                <p className="text-gray-600">
                    Highly qualified professionals dedicated to your health and wellbeing.
                </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {doctors.slice(0, 8).map((doctor) => (
                    <div 
                        onClick={() => { navigate(`/appointment/${doctor._id}`); window.scrollTo(0, 0) }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
                        key={doctor._id}
                    >
                        <div className="bg-gray-50 h-48 flex items-center justify-center p-4">
                            <img className="h-full object-contain" src={doctor.image} alt={doctor.name} />
                        </div>
                        <div className="p-5">
                            <div className="flex items-center mb-2">
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${doctor.available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className={`text-xs font-medium ${doctor.available ? 'text-green-600' : 'text-gray-500'}`}>
                                    {doctor.available ? 'Available Today' : 'Currently Unavailable'}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                            <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-12">
                <button 
                    onClick={() => { navigate('/doctors'); window.scrollTo(0, 0) }}
                    className="bg-gray-100 text-gray-700 font-medium px-8 py-3 rounded-full hover:bg-gray-200 transition-colors duration-300"
                >
                    View All Specialists
                </button>
            </div>
        </section>
    )
}

export default TopDoctors




// import React, { useContext } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { AppContext } from '../context/AppContext'
// const TopDoctors = () => {

//     const navigate = useNavigate()

//     const { doctors } = useContext(AppContext)

//     return (
//         <div className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'>
//             <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
//             <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
//             <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
//                 {doctors.slice(0, 10).map((item, index) => (
//                     <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
//                         <img className='bg-[#EAEFFF]' src={item.image} alt="" />
//                         <div className='p-4'>
//                             <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
//                                 <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
//                             </div>
//                             <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
//                             <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
//         </div>

//     )
// }

// export default TopDoctors
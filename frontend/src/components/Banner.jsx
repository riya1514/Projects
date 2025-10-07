// Banner.js
import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate()

    return (
        <div className="bg-teal-600 rounded-xl overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 py-12 md:py-16 text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Prioritize Your Health?</h2>
                        <p className="text-lg opacity-90 mb-6">
                            Join thousands of patients who trust our healthcare professionals.
                        </p>
                        <button 
                            onClick={() => { navigate('/login'); window.scrollTo(0, 0) }}
                            className="bg-white text-teal-700 font-medium px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
                        >
                            Get Started
                        </button>
                    </div>
                    <div className="md:w-1/2 hidden md:block relative h-64 md:h-80">
                        <img 
                            className="absolute bottom-0 right-0 h-full object-contain" 
                            src={assets.appointment_img} 
                            alt="Healthcare appointment" 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner





// import React from 'react'
// import { assets } from '../assets/assets'
// import { useNavigate } from 'react-router-dom'

// const Banner = () => {

//     const navigate = useNavigate()

//     return (
//         <div className='flex bg-teal-500 rounded-lg  px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>

//             {/* ------- Left Side ------- */}
//             <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5'>
//                 <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
//                     <p>Book Appointment</p>
//                     <p className='mt-4'>With 100+ Trusted Doctors</p>
//                 </div>
//                 <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create account</button>
//             </div>

//             {/* ------- Right Side ------- */}
//             <div className='hidden md:block md:w-1/2 lg:w-[370px] relative'>
//                 <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
//             </div>
//         </div>
//     )
// }

// export default Banner
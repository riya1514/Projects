// Header.js
import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
    return (
        <header className="bg-teal-600">
            <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="lg:w-1/2 space-y-6 text-white">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Expert Medical Care <br />At Your Convenience
                        </h1>
                        <div className="flex items-center gap-4">
                            <img className="w-24" src={assets.group_profiles} alt="Trusted patients" />
                            <p className="text-sm opacity-90">
                                Connect with board-certified specialists through our seamless appointment system.
                            </p>
                        </div>
                        <a 
                            href="#speciality" 
                            className="inline-flex items-center gap-2 bg-white text-teal-700 font-medium px-6 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
                        >
                            Find Your Specialist
                            <img className="w-3" src={assets.arrow_icon} alt="" />
                        </a>
                    </div>
                    <div className="lg:w-1/2 mt-8 lg:mt-0">
                        <img 
                            className="w-full max-w-lg mx-auto lg:ml-auto rounded-lg shadow-xl" 
                            src={assets.header_img} 
                            alt="Doctor consultation" 
                        />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header








// import React from 'react'
// import { assets } from '../assets/assets'

// const Header = () => {
//     return (
//         <div className='flex flex-col md:flex-row flex-wrap bg-teal-500 rounded-lg px-6 md:px-10 lg:px-20 '>

//             {/* --------- Header Left --------- */}
//             <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
//                 <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
//                     Book Appointment <br />  With Trusted Doctors
//                 </p>
//                 <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
//                     <img className='w-28' src={assets.group_profiles} alt="" />
//                     <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
//                 </div>
//                 <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
//                     Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
//                 </a>
//             </div>

//             {/* --------- Header Right --------- */}
//             <div className='md:w-1/2 relative'>
//                 <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
//             </div>
//         </div>
//     )
// }

// export default Header
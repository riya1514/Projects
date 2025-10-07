import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className="px-4 sm:px-10 py-12 bg-[#f9f9f9] min-h-screen">

      {/* Heading */}
      <div className='text-center text-3xl sm:text-4xl font-semibold text-gray-700 mb-12'>
        <p>Contact <span className='text-primary'>Us</span></p>
        <p className='text-sm text-[#707070] mt-2 font-normal'>We're here to help you anytime</p>
      </div>

      {/* Content Section */}
      <div className='flex flex-col-reverse md:flex-row items-center gap-12 bg-white rounded-2xl shadow-lg p-8 sm:p-14 max-w-6xl mx-auto'>

        {/* Text Content */}
        <div className='flex-1 flex flex-col gap-6'>
          <div>
            <p className='text-lg font-semibold text-gray-700 mb-1'>Our Office</p>
            <p className='text-gray-600 leading-relaxed'>416111 <br /> PICT, Pune, Maharashtra</p>
          </div>

          <div>
            <p className='text-gray-600 leading-relaxed'>
              Tel: (415) 555-0132 <br />
              Email: <a className='underline hover:text-primary' href='mailto:carebridge@gmail.com'>carebridge@gmail.com</a>
            </p>
          </div>

          <div>
            <p className='text-lg font-semibold text-gray-700 mb-1'>Careers at CareBridge</p>
            <p className='text-gray-600 mb-4'>Learn more about our teams and job openings.</p>
            <button className='px-6 py-3 rounded-full bg-primary text-white hover:bg-[#0056b3] transition-all duration-300 text-sm'>
              Explore Jobs
            </button>
          </div>
        </div>

        {/* Image */}
        <div className='flex-1'>
          <img className='w-full max-w-[400px] rounded-xl' src={assets.contact_image} alt="Contact us" />
        </div>
      </div>
    </div>
  )
}

export default Contact

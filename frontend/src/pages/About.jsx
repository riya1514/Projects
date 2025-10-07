import React from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Heart } from 'lucide-react';
import AboutHero from '../components/AboutHero';
import FeatureCard from '../components/FeatureCard';
import { Card } from '../components/Card';

const About = () => {
  const features = [
    {
      title: 'EFFICIENCY',
      description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
      icon: <Clock className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      title: 'CONVENIENCE',
      description: 'Access to a network of trusted healthcare professionals in your area.',
      icon: <MapPin className="h-8 w-8" />,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      title: 'PERSONALIZATION',
      description: 'Tailored recommendations and reminders to help you stay on top of your health.',
      icon: <Heart className="h-8 w-8" />,
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <AboutHero />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="my-16"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Our <span className="text-teal-500">Vision</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our vision at CareBridge is to create a seamless healthcare experience for every user.
            We aim to bridge the gap between patients and healthcare providers, making it easier for
            you to access the care you need, when you need it.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-lg rounded-2xl border-none">
          <div className="flex flex-col gap-6 text-gray-600 text-lg">
            <p>
              Welcome to CareBridge, your trusted partner in managing your healthcare needs
              conveniently and efficiently. At CareBridge, we understand the challenges individuals
              face when it comes to scheduling doctor appointments and managing their health records.
            </p>
            <p>
              CareBridge is committed to excellence in healthcare technology. We continuously strive
              to enhance our platform, integrating the latest advancements to improve user experience
              and deliver superior service. Whether you're booking your first appointment or managing
              ongoing care, CareBridge is here to support you every step of the way.
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-20"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">
            Why <span className="text-teal-500">Choose Us</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradientColor={feature.color}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;







// import React from 'react'
// import { assets } from '../assets/assets'

// const About = () => {
//   return (
//     <div>

//       <div className='text-center text-2xl pt-10 text-[#707070]'>
//         <p>ABOUT <span className='text-gray-700 font-semibold'>US</span></p>
//       </div>

//       <div className='my-10 flex flex-col md:flex-row gap-12'>
//         <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
//         <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
//           <p>Welcome to CareBridge, your trusted partner in managing your healthcare needs conveniently and efficiently. At CareBridge, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
//           <p>CareBridge is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, CareBridge is here to support you every step of the way.</p>
//           <b className='text-gray-800'>Our Vision</b>
//           <p>Our vision at CareBridge is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
//         </div>
//       </div>

//       <div className='text-xl my-4'>
//         <p>WHY  <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
//       </div>

//       <div className='flex flex-col md:flex-row mb-20'>
//         <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-teal-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
//           <b>EFFICIENCY:</b>
//           <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
//         </div>
//         <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-teal-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
//           <b>CONVENIENCE: </b>
//           <p>Access to a network of trusted healthcare professionals in your area.</p>
//         </div>
//         <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-teal-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
//           <b>PERSONALIZATION:</b>
//           <p >Tailored recommendations and reminders to help you stay on top of your health.</p>
//         </div>
//       </div>

//     </div>
//   )
// }

// export default About

import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

    const updateUserProfileData = async () => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { 
                headers: { token } 
            })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    return userData ? (
        <div className="w-full min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-blue-600 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">My Profile</h2>
                            {isEdit ? (
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={updateUserProfileData}
                                        className="px-5 py-2.5 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition"
                                    >
                                        Save Changes
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setIsEdit(false)
                                            setImage(false)
                                        }}
                                        className="px-5 py-2.5 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsEdit(true)}
                                    className="px-5 py-2.5 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Profile Picture - Larger */}
                            <div className="flex-shrink-0 flex flex-col items-center">
                                {isEdit ? (
                                    <label htmlFor='image' className="cursor-pointer">
                                        <div className="relative">
                                            <img 
                                                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl"
                                                src={image ? URL.createObjectURL(image) : userData.image} 
                                                alt="Profile"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                                <img className="w-10" src={assets.upload_icon} alt="Upload" />
                                            </div>
                                        </div>
                                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                                    </label>
                                ) : (
                                    <img 
                                        className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl" 
                                        src={userData.image} 
                                        alt="Profile" 
                                    />
                                )}
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">{userData.name}</h3>
                            </div>

                            {/* Profile Details - Expanded */}
                            <div className="flex-1 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-800">{userData.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                                        {isEdit ? (
                                            <input
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                type="text"
                                                value={userData.phone}
                                                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-gray-800">{userData.phone}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Address</label>
                                    {isEdit ? (
                                        <div className="space-y-3">
                                            <input
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                type="text"
                                                placeholder="Address Line 1"
                                                value={userData.address.line1}
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                                            />
                                            <input
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                type="text"
                                                placeholder="Address Line 2"
                                                value={userData.address.line2}
                                                onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                                            />
                                        </div>
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-gray-800">
                                                {userData.address.line1}<br />
                                                {userData.address.line2}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Gender</label>
                                        {isEdit ? (
                                            <select
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={userData.gender}
                                                onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                                            >
                                                <option value="Not Selected">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-gray-800">{userData.gender}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Date of Birth</label>
                                        {isEdit ? (
                                            <input
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                type="date"
                                                value={userData.dob}
                                                onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))}
                                            />
                                        ) : (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-gray-800">{userData.dob}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile




// import React, { useContext, useEffect, useState } from 'react'
// import { AppContext } from '../context/AppContext'
// import axios from 'axios'
// import { toast } from 'react-toastify'
// import { assets } from '../assets/assets'

// const MyProfile = () => {

//     const [isEdit, setIsEdit] = useState(false)

//     const [image, setImage] = useState(false)

//     const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

//     // Function to update user profile data using API
//     const updateUserProfileData = async () => {

//         try {

//             const formData = new FormData();

//             formData.append('name', userData.name)
//             formData.append('phone', userData.phone)
//             formData.append('address', JSON.stringify(userData.address))
//             formData.append('gender', userData.gender)
//             formData.append('dob', userData.dob)

//             image && formData.append('image', image)

//             const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

//             if (data.success) {
//                 toast.success(data.message)
//                 await loadUserProfileData()
//                 setIsEdit(false)
//                 setImage(false)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }

//     }

//     return userData ? (
//         <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>

//             {isEdit
//                 ? <label htmlFor='image' >
//                     <div className='inline-block relative cursor-pointer'>
//                         <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
//                         <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
//                     </div>
//                     <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
//                 </label>
//                 : <img className='w-36 rounded' src={userData.image} alt="" />
//             }

//             {isEdit
//                 ? <input className='bg-gray-50 text-3xl font-medium max-w-60' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} />
//                 : <p className='font-medium text-3xl text-[#262626] mt-4'>{userData.name}</p>
//             }

//             <hr className='bg-[#ADADAD] h-[1px] border-none' />

//             <div>
//                 <p className='text-gray-600 underline mt-3'>CONTACT INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]'>
//                     <p className='font-medium'>Email id:</p>
//                     <p className='text-blue-500'>{userData.email}</p>
//                     <p className='font-medium'>Phone:</p>

//                     {isEdit
//                         ? <input className='bg-gray-50 max-w-52' type="text" onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))} value={userData.phone} />
//                         : <p className='text-blue-500'>{userData.phone}</p>
//                     }

//                     <p className='font-medium'>Address:</p>

//                     {isEdit
//                         ? <p>
//                             <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address.line1} />
//                             <br />
//                             <input className='bg-gray-50' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address.line2} /></p>
//                         : <p className='text-gray-500'>{userData.address.line1} <br /> {userData.address.line2}</p>
//                     }

//                 </div>
//             </div>
//             <div>
//                 <p className='text-[#797979] underline mt-3'>BASIC INFORMATION</p>
//                 <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600'>
//                     <p className='font-medium'>Gender:</p>

//                     {isEdit
//                         ? <select className='max-w-20 bg-gray-50' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender} >
//                             <option value="Not Selected">Not Selected</option>
//                             <option value="Male">Male</option>
//                             <option value="Female">Female</option>
//                         </select>
//                         : <p className='text-gray-500'>{userData.gender}</p>
//                     }

//                     <p className='font-medium'>Birthday:</p>

//                     {isEdit
//                         ? <input className='max-w-28 bg-gray-50' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob} />
//                         : <p className='text-gray-500'>{userData.dob}</p>
//                     }

//                 </div>
//             </div>
//             <div className='mt-10'>

//                 {isEdit
//                     ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Save information</button>
//                     : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit</button>
//                 }

//             </div>
//         </div>
//     ) : null
// }

// export default MyProfile
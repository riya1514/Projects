import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyAppointments = () => {

    const { backendUrl, token } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const initPay = (order) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Appointment Payment',
            description: "Appointment Payment",
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {

                console.log(response)

                try {
                    const { data } = await axios.post(backendUrl + "/api/user/verifyRazorpay", response, { headers: { token } });
                    if (data.success) {
                        navigate('/my-appointments')
                        getUserAppointments()
                    }
                } catch (error) {
                    console.log(error)
                    toast.error(error.message)
                }
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    // Function to make payment using razorpay
    const appointmentRazorpay = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { token } })
            if (data.success) {
                initPay(data.order)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div className="px-4 sm:px-8">
            <h2 className="mt-12 mb-6 text-2xl font-semibold text-gray-700 border-b pb-2">My Appointments</h2>
            <div className="grid gap-6">
                {appointments.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 border border-gray-100"
                    >
                        <div className="flex-shrink-0">
                            <img className="w-32 h-32 object-cover rounded-xl bg-[#EAEFFF]" src={item.docData.image} alt="Doctor" />
                        </div>
    
                        <div className="flex-1 text-sm text-gray-600 flex flex-col justify-between">
                            <div>
                                <p className="text-xl font-semibold text-gray-800">{item.docData.name}</p>
                                <p className="text-sm mb-2">{item.docData.speciality}</p>
    
                                <p className="text-gray-700 font-medium mt-2">Address:</p>
                                <p>{item.docData.address.line1}</p>
                                <p>{item.docData.address.line2}</p>
    
                                <p className="mt-2"><span className="font-medium text-gray-800">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
                            </div>
                        </div>
    
                        <div className="flex flex-col justify-between text-sm items-center gap-3 sm:w-48">
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
                                <button
                                    onClick={() => setPayment(item._id)}
                                    className="w-full py-2 px-3 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                                >
                                    Pay Online
                                </button>
                            )}
    
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
                                <>
                                    <button
                                        onClick={() => appointmentStripe(item._id)}
                                        className="w-full py-2 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <img className="h-6" src={assets.stripe_logo} alt="Stripe" />
                                    </button>
                                    <button
                                        onClick={() => appointmentRazorpay(item._id)}
                                        className="w-full py-2 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                                    >
                                        <img className="h-6" src={assets.razorpay_logo} alt="Razorpay" />
                                    </button>
                                </>
                            )}
    
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <div className="w-full py-2 text-center bg-green-100 text-green-700 rounded-lg">
                                    Paid
                                </div>
                            )}
    
                            {item.isCompleted && (
                                <div className="w-full py-2 text-center border border-green-500 text-green-600 rounded-lg">
                                    Completed
                                </div>
                            )}
    
                            {!item.cancelled && !item.isCompleted && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className="w-full py-2 px-3 border border-red-500 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition"
                                >
                                    Cancel Appointment
                                </button>
                            )}
    
                            {item.cancelled && !item.isCompleted && (
                                <div className="w-full py-2 text-center border border-red-500 text-red-600 rounded-lg">
                                    Appointment Cancelled
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
    
}

export default MyAppointments

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GOOGLE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GOOGLE_GEMINI_API_URL = import.meta.env.VITE_GEMINI_API_URL;

const SmartAI = () => {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [symptomResponse, setSymptomResponse] = useState(null);
  const [matchedSpecialty, setMatchedSpecialty] = useState(null);

  const [file, setFile] = useState(null);
  const [reportSummaries, setReportSummaries] = useState({ English: null, Hindi: null, Marathi: null });
  const [activeLanguage, setActiveLanguage] = useState('English');
  const [isProcessingReport, setIsProcessingReport] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const navigate = useNavigate();

  const handleSymptomSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please describe your symptoms');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const apiResponse = await axios.post(
        `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze these symptoms: "${symptoms}". Provide:
1. 2-3 possible conditions (most likely first)
2. Immediate self-care measures
3. When to see a doctor
4. Based on the symptoms and conditions, recommend the most suitable doctor specialty from this list: General physician, Neurologist, Dermatologist, Gastroenterologist, Gynecologist, Pediatricians.

Format response as:
Possible Conditions: [bullet points]
Self-Care: [bullet points]
See a Doctor If: [bullet points]
Recommended Doctor: [Specialty]

Ensure the response is in plain text format without any special characters like *, #, or markdown symbols.`
                }
              ]
            }
          ]
        }
      );

      const analysisText = apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available';
      setSymptomResponse(analysisText);

      const match = analysisText.match(/Recommended Doctor:\s*(.+)/i);
      if (match) {
        const specialty = match[1].trim();
        setMatchedSpecialty(specialty);
      } else {
        setMatchedSpecialty('General physician');
      }
    } catch (err) {
      setError('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindDoctor = () => {
    if (matchedSpecialty) {
      navigate(`/doctors/${encodeURIComponent(matchedSpecialty)}`);
    } else {
      setError("Please analyze your symptoms first.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (JPEG/PNG)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    setError(null);

    if (selectedFile.type.includes('image')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a report file');
      return;
    }

    setIsProcessingReport(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result.split(',')[1];

        const languagePromises = ['English', 'Hindi', 'Marathi'].map(async (lang) => {
          const prompt = `Extract and summarize this medical report in ${lang} (simple terms). Include:
1. Key findings
2. Abnormal values
3. Recommended actions
Keep it concise (150-200 words).
Ensure the response is in plain text format without any special characters like *, #, or markdown symbols.`;

          const apiResponse = await axios.post(
            `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
            {
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: file.type,
                        data: base64Data
                      }
                    }
                  ]
                }
              ]
            }
          );
          return {
            language: lang,
            summary: apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available'
          };
        });

        const results = await Promise.all(languagePromises);
        const newSummaries = { English: null, Hindi: null, Marathi: null };
        results.forEach(result => {
          newSummaries[result.language] = result.summary;
        });

        setReportSummaries(newSummaries);
        setFile(null);
        setFilePreview(null);
      };
    } catch (err) {
      setError('Failed to process report. Please try again.');
    } finally {
      setIsProcessingReport(false);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Smart Health Assistant</h1>
      <p className="text-gray-600 mb-6">Get AI-powered analysis of your symptoms and medical reports</p>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-3">Common Symptoms</h3>
            <div className="space-y-2">
              {[
                'Headache, fever, fatigue',
                'Cough, sore throat, congestion',
                'Stomach pain, nausea, diarrhea',
                'Joint pain, swelling, stiffness'
              ].map((symptomSet, index) => (
                <button
                  key={index}
                  onClick={() => setSymptoms(symptomSet)}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded transition-colors"
                >
                  {symptomSet}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This AI analysis is for informational purposes only. Always consult a doctor for medical advice.
            </p>
          </div>
        </div>

        <div className="lg:w-3/4 space-y-6">
          {/* Symptom Analysis */}
          <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Symptom Analysis</h2>
            <form onSubmit={handleSymptomSubmit}>
              <textarea
                id="symptoms"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Example: Headache, fever, and fatigue for the past 2 days..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                disabled={isLoading || !symptoms.trim()}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
              </button>
            </form>

            {symptomResponse && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium mb-2 text-blue-800">Health Analysis</h3>
                <div className="whitespace-pre-wrap text-gray-700">{symptomResponse}</div>

                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg"
                  onClick={handleFindDoctor}
                >
                  Find a Doctor
                </button>
              </div>
            )}
          </div>

          {/* Report Analysis */}
          <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Medical Report Analysis</h2>
            <form onSubmit={handleReportSubmit}>
              <label className="block text-gray-700 font-medium mb-2">Upload your medical report:</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="mb-4" />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                disabled={!file || isProcessingReport}
              >
                {isProcessingReport ? 'Generating Summaries...' : 'Analyze Report'}
              </button>
            </form>

            {(reportSummaries.English || reportSummaries.Hindi || reportSummaries.Marathi) && (
              <div className="mt-6">
                <div className="flex border-b border-gray-200">
                  {['English', 'Hindi', 'Marathi'].map((lang) => (
                    <button
                      key={lang}
                      className={`px-4 py-2 font-medium text-sm ${activeLanguage === lang ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                      onClick={() => setActiveLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-blue-50 rounded-b-lg border border-blue-200 border-t-0">
                  <div className="whitespace-pre-wrap text-gray-700">
                    {reportSummaries[activeLanguage] || 'No summary available in this language'}
                  </div>
                  <button
                    onClick={() => {
                      setReportSummaries({ English: null, Hindi: null, Marathi: null });
                      setFile(null);
                      setFilePreview(null);
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear All Summaries
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default SmartAI;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const GOOGLE_GEMINI_API_KEY = "AIzaSyA2DRxDbZB00mQAgl0IA8TxtuSyGLQB-YA";
// const GOOGLE_GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// const SmartAI = () => {
//   // Symptom Analysis States
//   const [symptoms, setSymptoms] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [symptomResponse, setSymptomResponse] = useState(null);

//   // Report Analysis States
//   const [file, setFile] = useState(null);
//   const [reportSummaries, setReportSummaries] = useState({
//     English: null,
//     Hindi: null,
//     Marathi: null
//   });
//   const [activeLanguage, setActiveLanguage] = useState('English');
//   const [isProcessingReport, setIsProcessingReport] = useState(false);
//   const [filePreview, setFilePreview] = useState(null);

//   const navigate = useNavigate();

//   // Handle symptom analysis submission
//   const handleSymptomSubmit = async (e) => {
//     e.preventDefault();
//     if (!symptoms.trim()) {
//       setError('Please describe your symptoms');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const apiResponse = await axios.post(
//         `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
//         {
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Analyze these symptoms: "${symptoms}". Provide:
//                   1. 2-3 possible conditions (most likely first)
//                   2. Immediate self-care measures
//                   3. When to see a doctor
                  
//                   Format response as:
//                   Possible Conditions: [bullet points]
//                   Self-Care: [bullet points]
//                   See a Doctor If: [bullet points]
//                   Ensure the response is in plain text format without any special characters like *, #, or markdown symbols.`
//                 }
//               ]
//             }
//           ]
//         }
//       );
//       setSymptomResponse(apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available');
//     } catch (err) {
//       setError('Failed to analyze symptoms. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle file upload
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (!selectedFile) return;

//     // Validate file type
//     const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
//     if (!validTypes.includes(selectedFile.type)) {
//       setError('Please upload a PDF or image file (JPEG/PNG)');
//       return;
//     }

//     // Validate file size (5MB max)
//     if (selectedFile.size > 5 * 1024 * 1024) {
//       setError('File size should be less than 5MB');
//       return;
//     }

//     setFile(selectedFile);
//     setError(null);

//     // Create preview for images
//     if (selectedFile.type.includes('image')) {
//       const reader = new FileReader();
//       reader.onload = () => setFilePreview(reader.result);
//       reader.readAsDataURL(selectedFile);
//     } else {
//       setFilePreview(null);
//     }
//   };

//   // Handle report analysis submission
//   const handleReportSubmit = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       setError('Please upload a report file');
//       return;
//     }

//     setIsProcessingReport(true);
//     setError(null);

//     try {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = async () => {
//         const base64Data = reader.result.split(',')[1];

//         // Process all languages simultaneously
//         const languagePromises = ['English', 'Hindi', 'Marathi'].map(async (lang) => {
//           const prompt = `Extract and summarize this medical report in ${lang} (simple terms). Include:
//           1. Key findings
//           2. Abnormal values
//           3. Recommended actions
//           Keep it concise (150-200 words).
//           Ensure the response is in plain text format without any special characters like *, #, or markdown symbols.`;

//           const apiResponse = await axios.post(
//             `${GOOGLE_GEMINI_API_URL}?key=${GOOGLE_GEMINI_API_KEY}`,
//             {
//               contents: [
//                 {
//                   parts: [
//                     { text: prompt },
//                     {
//                       inlineData: {
//                         mimeType: file.type,
//                         data: base64Data
//                       }
//                     }
//                   ]
//                 }
//               ]
//             }
//           );
//           return {
//             language: lang,
//             summary: apiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No summary available'
//           };
//         });

//         const results = await Promise.all(languagePromises);
//         const newSummaries = { English: null, Hindi: null, Marathi: null };
//         results.forEach(result => {
//           newSummaries[result.language] = result.summary;
//         });

//         setReportSummaries(newSummaries);
//         setFile(null);
//         setFilePreview(null);
//       };
//     } catch (err) {
//       setError('Failed to process report. Please try again.');
//     } finally {
//       setIsProcessingReport(false);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-2">Smart Health Assistant</h1>
//       <p className="text-gray-600 mb-6">Get AI-powered analysis of your symptoms and medical reports</p>

//       <div className="flex flex-col lg:flex-row gap-6">
//         {/* Left Sidebar - Quick Symptoms */}
//         <div className="lg:w-1/4 space-y-4">
//           <div className="bg-white p-4 rounded-lg border border-gray-200">
//             <h3 className="font-medium mb-3">Common Symptoms</h3>
//             <div className="space-y-2">
//               {[
//                 'Headache, fever, fatigue',
//                 'Cough, sore throat, congestion',
//                 'Stomach pain, nausea, diarrhea',
//                 'Joint pain, swelling, stiffness'
//               ].map((symptomSet, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSymptoms(symptomSet)}
//                   className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded transition-colors"
//                 >
//                   {symptomSet}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
//             <p className="text-sm text-blue-800">
//               <strong>Note:</strong> This AI analysis is for informational purposes only. Always consult a doctor for medical advice.
//             </p>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="lg:w-3/4 space-y-6">
//           {/* Symptom Analysis Section */}
//           <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Symptom Analysis</h2>
//             <form onSubmit={handleSymptomSubmit}>
//               <div className="mb-4">
//                 <label htmlFor="symptoms" className="block text-gray-700 font-medium mb-2">
//                   Describe your symptoms:
//                 </label>
//                 <textarea
//                   id="symptoms"
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Example: Headache, fever, and fatigue for the past 2 days..."
//                   value={symptoms}
//                   onChange={(e) => setSymptoms(e.target.value)}
//                   disabled={isLoading}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
//                 disabled={isLoading || !symptoms.trim()}
//               >
//                 {isLoading ? 'Analyzing...' : 'Analyze Symptoms'}
//               </button>
//             </form>

//             {symptomResponse && (
//               <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <h3 className="font-medium mb-2 text-blue-800">Health Analysis</h3>
//                 <div className="whitespace-pre-wrap text-gray-700">
//                   {symptomResponse}
//                 </div>
//                 <button
//                   onClick={() => navigate('/doctors')}
//                   className="mt-4 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 font-medium py-1.5 px-4 rounded-lg text-sm"
//                 >
//                   Find a Doctor
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Report Analysis Section */}
//           <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Medical Report Analysis</h2>
//             <form onSubmit={handleReportSubmit}>
//               <div className="mb-4">
//                 <label className="block text-gray-700 font-medium mb-2">
//                   Upload your medical report:
//                 </label>
//                 <div className="flex items-center gap-4">
//                   <label className="flex-1 cursor-pointer">
//                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
//                       <input
//                         type="file"
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         onChange={handleFileChange}
//                         className="hidden"
//                         disabled={isProcessingReport}
//                       />
//                       <div className="text-center">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           className="h-10 w-10 mx-auto text-gray-400"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                           />
//                         </svg>
//                         <p className="mt-2 text-sm text-gray-600">
//                           {file ? file.name : 'Click to upload PDF or image'}
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">
//                           Max file size: 5MB
//                         </p>
//                       </div>
//                     </div>
//                   </label>
//                   {filePreview && (
//                     <div className="w-24 h-24 border rounded-md overflow-hidden">
//                       <img
//                         src={filePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
//                 disabled={!file || isProcessingReport}
//               >
//                 {isProcessingReport ? 'Generating Summaries...' : 'Analyze Report'}
//               </button>
//             </form>

//             {(reportSummaries.English || reportSummaries.Hindi || reportSummaries.Marathi) && (
//               <div className="mt-6">
//                 <div className="flex border-b border-gray-200">
//                   {['English', 'Hindi', 'Marathi'].map((lang) => (
//                     <button
//                       key={lang}
//                       className={`px-4 py-2 font-medium text-sm ${
//                         activeLanguage === lang
//                           ? 'border-b-2 border-blue-500 text-blue-600'
//                           : 'text-gray-500 hover:text-gray-700'
//                       }`}
//                       onClick={() => setActiveLanguage(lang)}
//                     >
//                       {lang}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="p-4 bg-blue-50 rounded-b-lg border border-blue-200 border-t-0">
//                   <div className="whitespace-pre-wrap text-gray-700">
//                     {reportSummaries[activeLanguage] || 'No summary available in this language'}
//                   </div>
//                   <button
//                     onClick={() => {
//                       setReportSummaries({ English: null, Hindi: null, Marathi: null });
//                       setFile(null);
//                       setFilePreview(null);
//                     }}
//                     className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
//                   >
//                     Clear All Summaries
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs">
//           <div className="flex items-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//               />
//             </svg>
//             <span>{error}</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SmartAI;








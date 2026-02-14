import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "../../components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import QuestionCard from "../../components/Cards/QuestionCard";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLearnMoreDrawer, setOpenLearnMoreDrewer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId),
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error", error);
      setErrorMsg("Failed to fetch session details");
    }
  };

  // Generate Concept Explanation
  const generateConceptExplanation = async (question) => {
    try {
      if (!question) return; 

      setIsLoading(true);
      setExplanation(null);
      setOpenLearnMoreDrewer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        },
      );

      if (response.data?.success) {
        setExplanation(response.data.explanation);
        toast.success("Explanation generated!");
      } else {
        toast.error("Failed to generate explanation");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating explanation");
    } finally {
      setIsLoading(false);
    }
  };

  // Pin Question (you can implement later)
  // const toggleQuestionPinStatus = async () => {};
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      if (!questionId) return;

      const response = await axiosInstance.patch(
        API_PATHS.QUESTION.PIN(questionId),
      );

      if (response.data?.success) {
        const updatedQuestion = response.data.question;

        // Update sessionData in UI without reload
        setSessionData((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            questions: prev.questions.map((q) =>
              q._id === questionId
                ? { ...q, isPinned: updatedQuestion.isPinned }
                : q,
            ),
          };
        });

        toast.success(updatedQuestion.isPinned ? "Pinned!" : "Unpinned!");
      } else {
        toast.error("Failed to update pin status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating pin status");
    }
  };

  // Add more question to a session
  const uploadMoreQuestions = async () => {
    try {
      if (!sessionId) return;

      setIsUpdateLoader(true);

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
        },
      );

      if (response.data?.success) {
        toast.success("More questions added!");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Failed to add questions");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating more questions");
    } finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
  }, [sessionId]);

  return (
    <div className="ml-10">
      <DashboardLayout>
        <RoleInfoHeader
          role={sessionData?.role || ""}
          topicsToFocus={sessionData?.topicsToFocus || ""}
          experience={sessionData?.experience || "_"}
          questions={sessionData?.questions?.length || "_"}
          description={sessionData?.description || ""}
          lastUpdated={
            sessionData?.updatedAt
              ? moment(sessionData?.updatedAt).format("Do MMM YYYY")
              : ""
          }
        />

        <div className="container mx-auto pt-4 pb-4 px-4 md:px-0">
          <h2 className="text-lg font-semibold text-black">Interview Q & A</h2>

          {/* MAIN GRID (Questions + Explanation) */}
          <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
            {/* LEFT SIDE - Questions */}
            <div
              className={`col-span-12 ${
                openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-12"
              }`}
            >
              <AnimatePresence>
                {sessionData?.questions?.map((data, index) => (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      oneLearnMore={() =>
                        generateConceptExplanation(data.question)
                      }
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RIGHT SIDE - Explanation Drawer */}
            {openLearnMoreDrawer && (
              <div className="col-span-12 md:col-span-5">
                <div className="bg-white border rounded-xl shadow-md p-4 sticky top-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Explanation</h3>

                    <button
                      className="text-red-500 font-semibold"
                      onClick={() => setOpenLearnMoreDrewer(false)}
                    >
                      Close
                    </button>
                  </div>

                  {isLoading ? (
                    <p className="text-gray-500">Generating explanation...</p>
                  ) : explanation ? (
                    <div className="max-h-[70vh] overflow-y-auto whitespace-pre-line text-gray-700">
                      {explanation}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      Click <b>Learn More</b> on any question to see
                      explanation.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ADD MORE QUESTIONS BUTTON */}
          <button
            className="fixed bottom-10 z-20 right-10 h-12 flex items-center gap-3 bg-orange-500 text-white px-7 py-2.5 rounded-full shadow-lg hover:bg-orange-600 transition-all"
            onClick={uploadMoreQuestions}
            disabled={isUpdateLoader}
          >
            {isUpdateLoader ? "Adding..." : "ADD MORE QUESTIONS"}
          </button>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default InterviewPrep;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import moment from "moment";
// import { AnimatePresence, motion } from "framer-motion";
// import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
// // import {SpinnerLoader} from "../../components/Loader/SpinnerLoader";
// import { toast } from "react-hot-toast";
// import DashboardLayout from "../../components/layouts/DashboardLayout";
// import RoleInfoHeader from "../../components/RoleInfoHeader";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPath";
// import QuestionCard from "../../components/Cards/QuestionCard";

// const InterviewPrep = () => {
//   const { sessionId } = useParams();

//   const [sessionData, setSessionData] = useState(null);
//   const [errorMsg, setErrorMsg] = useState("");

//   const [openLearnMoreDrawer, setOpenLearnMoreDrewer] = useState(false);
//   const [explanation, setExplanation] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isUpdateLoader, setIsUpdateLoader] = useState(false);

//   //Fetch session data by session id
//   const fetchSessionDetailsById = async () => {
//     try {
//       const response = await axiosInstance.get(
//         API_PATHS.SESSION.GET_ONE(sessionId),
//       );
//       if (response.data && response.data.session) {
//         setSessionData(response.data.session);
//       }
//     } catch (error) {
//       console.error("Error", error);
//     }
//   };

//   //Generate Concept Explanation
//   const generateConceptExplanation = async (question) => {
//     try {
//       if (!question) return;

//       setIsLoading(true);
//       setExplanation(null);
//       setOpenLearnMoreDrewer(true);

//       const response = await axiosInstance.post(
//         API_PATHS.AI.GENERATE_EXPLANATION,
//         {
//           question,
//         },
//       );

//       if (response.data?.success) {
//         setExplanation(response.data.explanation);
//         console.log(response.data.explanation)
//         toast.success("Explanation generated!");
//       } else {
//         toast.error("Failed to generate explanation");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error generating explanation");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   //pin Question
//   const toggleQuestionPinStatus = async () => {};

//   //Add more question to a session
//   const uploadMoreQuestions = async () => {
//     try {
//       if (!sessionId) return;

//       setIsUpdateLoader(true);

//       const response = await axiosInstance.post(
//         API_PATHS.QUESTION.ADD_TO_SESSION,
//         {
//           sessionId,
//         },
//       );
//       if (response.data?.success) {
//         setSessionData(response.data.createdQuestions);
//         toast.success("More questions added!");
//         setTimeout(() => {
//           window.location.reload();
//         }, 1000);
//       } else {
//         toast.error("Failed to add questions");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Error generating more questions");
//     } finally {
//       setIsUpdateLoader(false);
//     }
//   };

//   useEffect(() => {
//     if (sessionId) {
//       fetchSessionDetailsById();
//     }
//     return () => {};
//   }, []);

//   return (
//     <div className="ml-10">
//       <DashboardLayout>
//         <RoleInfoHeader
//           role={sessionData?.role || ""}
//           topicsToFocus={sessionData?.topicsToFocus || ""}
//           experience={sessionData?.experience || "_"}
//           questions={sessionData?.questions?.length || "_"}
//           description={sessionData?.description || ""}
//           lastUpdated={
//             sessionData?.updatedAt
//               ? moment(sessionData?.updatedAt).format("Do MMM YYYY")
//               : ""
//           }
//         />

//         <div className=" container mx-auto pt-4 pb-4 px-4 md:px-0">
//           <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
//           <div className="w-full flex">
//             <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
//               <div
//                 className={`col-span-12 ${openLearnMoreDrawer ? "md:col-span-7" : "md:col-span-8"}`}
//               >
//                 <AnimatePresence>
//                   {sessionData?.questions?.map((data, index) => {
//                     return (
//                       <motion.div
//                         key={data._id || index}
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, scale: 0.95 }}
//                         transition={{
//                           duration: 0.4,
//                           type: "String",
//                           stiffness: 100,
//                           delay: index * 0.1,
//                           damping: 15,
//                         }}
//                         layout //This is the key prop that animates position changes
//                         layoutId={`question-${data._id || index}`} //helps framer track specific items
//                       >
//                         <>
//                           <QuestionCard
//                             question={data?.question}
//                             answer={data?.answer}
//                             oneLearnMore={() =>
//                               generateConceptExplanation(data.question)
//                             }
//                             isPinned={data?.isPinned}
//                             onTogglePin={() =>
//                               toggleQuestionPinStatus(data._id)
//                             }
//                           />
//                         </>
//                       </motion.div>
//                     );
//                   })}
//                 </AnimatePresence>
//               </div>
//             </div>
//             {/* <div className="mr-32"><textarea value={explanation}></textarea></div> */}
//             {openLearnMoreDrawer && (
//               <div className=" max-w-48 ">
//                 {explanation}
//               </div>
//             )}
//           </div>
//           <button
//             className="fixed bottom-10 z-20 right-10 h-12 flex items-center gap-3 bg-orange-500 text-white px-7 py-2.5 rounded-full shadow-lg hover:bg-orange-600 transition-all"
//             onClick={uploadMoreQuestions}
//           >
//             ADD MORE QUESTIONS
//           </button>
//         </div>
//       </DashboardLayout>
//     </div>
//   );
// };

// export default InterviewPrep;

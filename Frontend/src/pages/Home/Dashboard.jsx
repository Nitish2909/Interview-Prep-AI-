import React, { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal"
import CreateSessionForm from "./CreateSessionForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false)

  const deleteSession = async (id)=>{
    const response = await axiosInstance.delete(API_PATHS.SESSION.DELETE(id));
    
    setTimeout(()=>{ 
      window.location.reload()
    },1000)
  }


  const fetchAllSessions = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data || []);
    } catch (error) {
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

 
  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7">
          
          
          {isLoading ? (
            <p className="text-center col-span-full py-10">Loading...</p>
          ) : (
            sessions?.map((data, index) => (
              <SummaryCard
                key={data?._id}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role}
                topicsToFocus={data?.topicsToFocus}
                experience={data?.experience}
                questions={data?.questions?.length || 0}
                description={data?.description}
                lastUpdated={moment(data?.updatedAt).format("Do MMM YYYY")}
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={()=>deleteSession(data?._id)}
                
              />
            ))
          )}

          
          {!isLoading && sessions.length === 0 && (
            <p className="text-center col-span-full py-10 text-gray-500">
              No sessions found.
            </p>
          )}
        </div>

        <button
          className="fixed bottom-10 right-10 h-12 flex items-center gap-3 bg-orange-500 text-white px-7 py-2.5 rounded-full shadow-lg hover:bg-orange-600 transition-all"
          // onClick={() => navigate("/create-session")} 
          onClick={() => setOpenCreateModal(true)}

        >
          <LuPlus className="text-2xl" />
          Add New
        </button>
      </div>

      <Modal 
      isOpen={openCreateModal}
      onClose={
        ()=>{
          setOpenCreateModal(false)
        }
      }
      hideHeader>
        <div>
          <CreateSessionForm/>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
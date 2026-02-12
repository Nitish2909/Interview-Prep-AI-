import React from 'react'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'

const ProfileInfoCard = () => {
    const {user, clearUser} = useContext(UserContext)
    const navigate = useNavigate();

    const handleLogOut = ()=>{
        localStorage.clear();
        clearUser();
        navigate("/");
    }
  return (
    user &&(
    <div>
      <div className="flex items-center">
        <img
        src={user.profileImageUrl}
        alt="profileImage"
        className="w-11 h-11 bg-gray-300 rounded-full mr-3"
        />
        <div>
            <div className="text-[15px] text-black font-bold leading-3" >
                {user.fullname || ""}
            </div>
            <button className="text-amber-600 text-sm font-semibold cursor-pointer hover:underline"  onClick={handleLogOut}>
                LogOut
            </button>
        </div>
      </div>
    </div>
  ))
}

export default ProfileInfoCard

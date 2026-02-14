import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);


  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();

  //handle SignUp Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");

    //SignUp API call
    try {

      //Upload image if Present
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl= imageUploadRes.imageUrl || ""
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullname:fullName,
        email,
        password,
        profileImageUrl
      })

      const {token} = response.data;

      if(token){
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard")
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something Went wrong. Please try again.");
      }
    }
  };
  return (
    <div className="w-[90vw] md:w-[33vw] p-3 flex flex-col  ">
      <h3 className="text-lg font-semibold text-black ml-29">Create an Account</h3>
      <p className="text-xs text-slate-700 mt-[5px] mb-6 ml-20">
        Join us today by entering your details below
      </p>

      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label="Full Name"
            placeholder="Nitish"
            type="text"
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email"
            placeholder="You@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 Characters"
            type="password"
          />
        </div>
        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
        <button type="submit" className="btn-primary">
          Sign Up
        </button>
        <p className="text-[13px] text-slate-800 ">
          Already an Account?{" "}
          <button
          type="button"
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;

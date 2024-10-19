import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateAxiosInstance from "../Axios";
import axios from "axios";

const Register = () => {

    const axiosInstance = CreateAxiosInstance()

    const { setLogin } = useState()
    const [staff, setStaff] = useState("baseUser")
    const [formData, setFormData] = useState({
        email: "",
        password1: "",
        password2: "",
        username: "",
        first_name: "",
        last_name: "",
        // phone: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async (e) => {
        e.preventDefault(); 

        if (formData.password1 !== formData.password2) {
          // toast.error("Passwords do not match");
          return;
        }

        try {
          const res = await axios.post( "http://13.60.208.123:8000/signup/", {
            email: formData.email,
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            password: formData.password1,
          });
          console.log(res);
          console.log("Registered successfully");
          setLogin(true)
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          res.data.role === null ? localStorage.setItem("role", "undefined") : localStorage.setItem("role", res.data.role)
          axiosInstance.defaults.headers["Authorization"] =
            "JWT " + localStorage.getItem("access_token");
          console.log("Navigating");
        //   const decode = res.data.access
          navigate("/");
        } catch (error) {
          console.error("Error:", error);
        }
    };

    return (
        <div className="grid grid-cols-5">
            <div className="md:col-span-3 md:block hidden">
                <img src="https://huddle.day/assets/templates/basic/frontend2/media-uploader/join-us.png" alt="random" className="" />

            </div>
            <div className="md:col-span-2 col-span-5 flex items-center justify-center">
                <div className="flex flex-col w-4/5 justify-center my-12">
                    {/* <div className="flex w-full">
            <button onClick={() => { setStaff("baseUser") }} className={`mx-auto border-2 w-full py-1 rounded-md ${staff !== "baseUser" ? " text-[#FF6B66]" : "bg-[#FF6B66] text-white"}`}>User</button>
            <button onClick={() => { setStaff("staff") }} className={`mx-auto border-2 w-full py-1 rounded-md bg-[#] ${staff !== "staff" ? " text-[#FF6B66]" : "bg-[#FF6B66] text-white"}`}>Staff</button>
          </div> */}
                    <label htmlFor="username" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "13px" }}>
                        &nbsp;Username
                    </label>
                    <input
                        type="text"
                        name="username"
                        onChange={handleChange}
                        placeholder="Username"
                        id="username"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        autoComplete="on"
                        required
                    />
                    <div className="form-border"></div>
                    <label htmlFor="first_name" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "13px" }}>
                        &nbsp;First name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        onChange={handleChange}
                        id="first_name"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        placeholder="First Name"
                        autoComplete="on"
                        required
                    />
                    <div className="form-border"></div>
                    <label htmlFor="last_name" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "13px" }}>
                        &nbsp;Last name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        onChange={handleChange}
                        placeholder="Last Name"
                        id="last_name"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        autoComplete="on"
                        required
                    />
                    <div className="form-border"></div>
                    <label htmlFor="email" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "13px" }}>
                        &nbsp;Email
                    </label>
                    <input
                        id="email"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        onChange={handleChange}
                        type="email"
                        name="email"
                        autoComplete="on"
                        placeholder="E-Mail"
                        required
                    />
                    <div className="form-border"></div>
                    <label htmlFor="password1" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "22px" }}>
                        &nbsp;Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password1"
                        onChange={handleChange}
                        id="password1"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        required
                    />
                    <div className="form-border"></div>
                    <label htmlFor="password2" className="text-[#FF6B66] text-md font-bold" style={{ paddingTop: "22px" }}>
                        &nbsp;Confirm Password
                    </label>
                    <input
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        id="password2"
                        className="p-3 px-3 bg-[#faefe8] rounded-md focus:outline-none"
                        required
                    />
                    <div className="form-border"></div>
                    <button
                        type="submit"
                        onClick={handleSave}
                        className="bg-[#FF6B66] hover:bg-gray-900 w-full text-white font-thin py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline mt-5"
                    >
                        Register
                    </button>
                    <Link to="/login" className="flex justify-center mb-4 text-[#FF6B66]">
                        Already a user? Sign-In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;

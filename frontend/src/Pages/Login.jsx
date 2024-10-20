import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateAxiosInstance from "../Axios";
import { MyContext } from "../Context/MyContext"
import axios from "axios";

const Login = () => {

  const { setLogin} = useContext(MyContext)
  const axiosInstance = CreateAxiosInstance()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append("email", formData.email);
    postData.append("password", formData.password);

    try {
      console.log(postData);
      const res = await axios.post(`http://192.168.0.107:8000/login/`, postData);
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      axiosInstance.defaults.headers["Authorization"] =
        "Bearer " + localStorage.getItem("access_token");
      setLogin(true)
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5">
        <div className="md:col-span-3 md:block hidden">
              <img src="https://images.squarespace-cdn.com/content/v1/6362a31ebcf57907d45a58bc/4caac7f7-353a-45d6-8817-8e8a4a4fb853/wordsmith-custom-blog-Internal-communications-importing-marketing-lessons.png?format=1500w" alt="random" className="w-11/12 lg:h-[29rem]"/>
        </div>
        <div className="md:col-span-2 col-span-5 m-16 flex flex-col justify-center" >
          <label htmlFor="user-email" className="text-[#008370] text-md font-bold" style={{ paddingTop: "13px" }}>
            Email
          </label>
          <input
            id="user-email"
            className="form-content my-2 bg-[#d6ebe8] p-3 rounded-md focus:outline-none"
            type="email"
            name="email"
            placeholder="Email"
            onChange={(e) => handleChange(e)}
            autoComplete="on"
            required
          />
          <div className="form-border"></div>
          <label htmlFor="user-password" className="text-[#008370] text-md font-bold" style={{ paddingTop: "22px" }}>
            Password
          </label>
          <input
            id="user-password"
            className="form-content my-2 bg-[#d6ebe8] p-3 rounded-md focus:outline-none"
            type="password"
            name="password"
            placeholder="******"
            onChange={(e) => handleChange(e)}
            required
          />
          <div className="form-border"></div>
          <input
            id="submit-btn"
            type="submit"
            name="submit"
            value="LOGIN"
            className="bg-[#008370] p-2 rounded-xl text-white mt-4 cursor-pointer hover:bg-gray-900"
            onClick={handleSubmit}
          />
          <a href="#" id="signup">
            <Link to="/register" className="mb-4 text-[#008370] font-bold text-sm hover:text-blue-800">
              Don't Have an account?
            </Link>
          </a>
        </div>
      </div>
    </>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// import logo from "../Assets/logo.png";

const links = [
  { name: "Home", path: "/", color: "#00" },
  { name: "Events", path: "/events", color: "#00FFFFF" },
  { name: "Committee", path: "/Commiteehome", color: "#00FFFFF" },
  { name: "Profile", path: "/Profile", color: "#00FFFFF", protected: true },
  { name: "Login", path: "/login", color: "#00FFFFF", protected: false }
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [formerColor, setFormerColor] = useState(links[0].color);
  const [isVisible, setIsVisible] = useState(true); // Manage navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const isLoggedIn = !!localStorage.getItem("access_token");

  // Function to handle scroll behavior
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Hide navbar when scrolling down
      setIsVisible(false);
    } else {
      // Show navbar when scrolling up
      setIsVisible(true);
    }

    // Update the last scroll position
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener when component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`bg-[#E5E4E2] font-bold text-2xl fixed w-full z-20 top-0 start-0 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link to="/">
            {/* <img src={logo} className="h-14 w-24" alt="Logo" /> */}
          </Link>
        </div>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`w-5 h-5 ${isMenuOpen ? 'text-gray-900' : 'text-white'}`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            isMenuOpen ? 'block' : 'hidden'
          }`}
          id="navbar-sticky"
        >
          <ul className="md:gap-14 flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
            {links.map(({ name, path, color, protected: isProtected }, i) => (
              (isProtected ? isLoggedIn : true) && (
                <motion.li
                  key={name}
                  onClick={() => {
                    setFormerColor(links[selected].color);
                    setSelected(i);
                  }}
                  style={{ position: "relative" }}
                >
                  <Link
                    to={path}
                    className="block py-2 px-3 rounded text-white"
                    aria-current={i === selected ? "page" : undefined}
                  >
                    {name}
                    {i === selected && (
                      <motion.div
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          borderRadius: 15,
                          top: 0,
                          left: 0,
                          backgroundColor: color,
                        }}
                        layoutId="selected"
                        initial={{ backgroundColor: formerColor }}
                        animate={{ backgroundColor: color }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.li>
              )
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { motion } from 'framer-motion';
import CarbonFootprintCalculator from "../Components/CarbonFootprint";
import Maps from "../Components/Maps";

const Calculator = () => {
    return (
        <>
            <div
                className="bg-[#008370] h-[670px] w-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('https://img.freepik.com/free-photo/view-green-forest-trees-with-co2_23-2149675039.jpg?ga=GA1.1.79250162.1729396100&semt=ais_hybrid')", // Replace with your image URL
                }}
            >
                <div className='mx-80 py-24'>
                    <CarbonFootprintCalculator />
                </div>
            </div>

            <div className='mx-20 my-24'>
                <motion.h2
                    className="text-6xl font-bold mb-4 text-center text-[#008370]"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    What will my carbon offsets support?
                </motion.h2>
                <motion.p
                    className="text-lg text-gray-700 mb-6 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    We stretch the impact of your carbon offset purchase by distributing each dollar across our Climate Impact Portfolio. This includes a mix of forestry, energy, blue/teal carbon, and innovative tech projects. We carefully select every carbon offset project we include in our portfolio, ensuring they comply not only with the most rigorous standards for carbon offsetting but pass our own due diligence test. In addition to fighting climate change, we seek out projects that deliver social and environmental benefits beyond CO2 reductions and contribute to the UN Sustainable Development Goals.
                </motion.p>
            </div>

            <div className=' p-10 bg-slate-300'>
                <motion.h2
                    className="text-4xl font-bold mb-4 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Practices to Reduce Carbon Emissions
                </motion.h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Example Card 1 */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="font-semibold text-3xl mb-2">Use Public Transport</h3>
                        <img
                            src="https://wri-india.org/sites/default/files/styles/large/public/Five%20Ways%20to%20Promote%20Public%20Transport%20in%20Indian%20Cities-Blog.jpg?itok=CFDInE9K" // Replace with your image URL
                            alt="Public Transport"
                            className="mb-4 rounded w-full h-62 object-cover"
                        />
                        <p className="text-gray-600">
                            Opt for buses, trains, or subways to reduce your carbon footprint compared to driving.
                        </p>
                    </motion.div>

                    {/* Example Card 2 */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="font-semibold text-3xl mb-2">Support Renewable Energy</h3>
                        <img
                            src="https://media.licdn.com/dms/image/D5612AQGsiba_ua8qBw/article-cover_image-shrink_720_1280/0/1716994485940?e=2147483647&v=beta&t=OmYYDeaAtfHDsTsWK4g8LnpAx5yso86VM0kW7jPaaPM" // Replace with your image URL
                            alt="Renewable Energy"
                            className="mb-4 rounded w-full h-62 object-cover"
                        />
                        <p className="text-gray-600">
                            Choose renewable energy options for your home and support clean energy initiatives.
                        </p>
                    </motion.div>

                    {/* Example Card 3 */}
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        initial={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <h3 className="font-semibold text-3xl mb-2">Reduce, reuse, and recycle</h3>
                        <img
                            src="https://innovation-yachts.com/wp-content/uploads/2024/06/3R-reduce-reuse-recycle_s.jpg" // Replace with your image URL
                            alt="Reduce, reuse, and recycle"
                            className="mb-4 rounded w-full h-62 object-cover"
                        />
                        <p className="text-gray-600">
                            Recycling and reusing materials reduces the amount of waste that ends up in landfills, incinerators, or oceans, where they pollute the environment and emit greenhouse gases
                        </p>
                    </motion.div>
                </div>

            </div>
        </>
    );
}

export default Calculator;

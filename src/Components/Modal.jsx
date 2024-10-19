import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Modal = ({ handleCloseModal, modalContent, showModal }) => {
    const [content, setContent] = useState(modalContent);

    useEffect(() => {
        setContent(modalContent);
    }, [modalContent]);

    const handleClose = () => {
        // This will trigger the exit animation before removing the modal
        handleCloseModal();
    };

    return (
        <AnimatePresence>
            {showModal && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    id="static-modal"
                    tabIndex="-1"
                    aria-hidden="true"
                    className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-opacity-50 "
                >
                    <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div className="relative bg-white rounded-3xl border-[#FF6B66] border">
                            <div className="p-4 md:p-5 space-y-4">
                                <form>
                                    <div className="mb-4">
                                        <div className="flex items-center">
                                            <img
                                                src="profile1.jpg"
                                                alt="Profile 1"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <p className="ml-2 text-3xl font-bold text-[#FF6B66]">Profile 1 Name</p>
                                        </div>
                                        <textarea
                                            className="appearance-none border-white rounded w-full py-2 px-3"
                                            style={{ borderWidth: '1px', borderStyle: 'solid' }}
                                            id="description"
                                            name="description"
                                            placeholder="Description"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="flex items-center p-4 md:p-5">
                                <button
                                    onClick={handleClose}
                                    type="button"
                                    className="text-white ml-auto focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center bg-[#FF6B66]"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


// import { Modal } from '../Components/Modal';


// const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState('');

//   const handleOpenModal = (content) => {
//     setModalContent(content);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//     setModalContent('');
//   };

//   <motion.button  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => handleOpenModal('Notes for Profile 1')}> <MdOutlineSpeakerNotes className='size-8' color="#FF6B66" /></motion.button>
//   <Modal handleCloseModal={handleCloseModal}  modalContent={modalContent} showModal={showModal}/>
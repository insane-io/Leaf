import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

export default function App({images}) {
  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
      {
      images.map((d)=>(
        <SwiperSlide><img src={`${d}`} alt="" className='h-[30rem] w-full'/></SwiperSlide>
      ))
    }
      </Swiper>
    </>
  );
}

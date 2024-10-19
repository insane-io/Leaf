import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

export default function App() {
  return (
    <>
      <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
        <SwiperSlide><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMq0Utl9O-TUtLMs4xn6n1q0jyqAYN0YB3w&s" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMq0Utl9O-TUtLMs4xn6n1q0jyqAYN0YB3w&s" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMq0Utl9O-TUtLMs4xn6n1q0jyqAYN0YB3w&s" alt="" /></SwiperSlide>
        <SwiperSlide><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIMq0Utl9O-TUtLMs4xn6n1q0jyqAYN0YB3w&s" alt="" /></SwiperSlide>
      </Swiper>
    </>
  );
}

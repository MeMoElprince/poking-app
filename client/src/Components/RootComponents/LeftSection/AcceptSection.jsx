import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AcceptFriendCard from "../../UiComponents/AcceptFriendCard";
import { GetFriendsRequest } from '../../../Store/urls';
import LoadingSpinner from '../../UiComponents/LoadingSpinner';
import useFetch from '../../CustomHooks/useFetch'
const url = GetFriendsRequest();


// eslint-disable-next-line react/prop-types
export default function AcceptSection({ className = "" }) {
  const { data, Loading } = useFetch(url, 'GET');
  

  return (
    <div className={`border-r-2 border-background1 pt-5 sm:pl-5 pl-2 ${className}`}>
      <h1 className="text-2xl font-bold mb-10">Accept Friends</h1>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-0px)] space-y-3 overflow-auto sm:pr-5 pr-2">
        {
          Loading && 
          <div className='flex justify-center items-center'>
            <LoadingSpinner />
          </div>
        }
        {
          !Loading && data &&
          <>
            {data.count === 0 && <div className='text-center text-lg'>No Friends Request</div>}
            {data.count !== 0 && 
              data.map((item, index) => (
                <AcceptFriendCard key={index} Img={item.imgName} Title={item.name} />
              ))
            }
          </>
        }
      </motion.div>
    </div>
  )
}

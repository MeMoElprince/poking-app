/* eslint-disable react/prop-types */
import moment from "moment";
import { motion } from "framer-motion";

export default function ReceivedMessage({time,message,customeStyle}) {
  const timeInHours = moment(new Date(time)).format("hh:mm A");
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`bg-background1 max-w-full w-fit py-2 px-5 rounded-lg relative ${customeStyle}`}
      style={{direction:'rtl', wordWrap:'break-word'}}
    >
      <div className="absolute top-0 left-0 w-0 h-0 border-solid border-transparent border-r-8 border-t-8 bg-background1"></div>
      <div style={{ direction: 'ltr' }}>
        {message}
      </div>
      <p dir="ltr" className="text-right text-sm pt-2 opacity-80">{timeInHours}</p>
    </motion.div>
  )
}

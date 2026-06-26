/* eslint-disable react/prop-types */
import moment from "moment";
import { motion } from "framer-motion";
import { BsCheckAll, BsClock } from "react-icons/bs";

function TextWithLinkChecker({ text }) {
  // Regular expression to find URLs in the text
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Function to check if the text contains a link
  const hasLink = text.match(urlRegex);

  // Function to render the text with link if found
  const renderTextWithLink = () => {
    // If no link found, simply render the text
    if (!hasLink) {
      return <span>{text}</span>;
    }

    // Split the text into parts by the link
    const parts = text.split(urlRegex);

    // Map each part to render it with link if it's a link, otherwise render as text
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return <a key={index} href={part} target="_blank" className="hover:border-b-2" >{part}</a>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div>
      {renderTextWithLink()}
    </div>
  );
}

// status: 'sending' | 'sent' | 'read' (undefined => sent)
function StatusTick({ status }) {
  if (status === 'sending')
    return <BsClock size={13} className="opacity-70" title="Sending" />;
  if (status === 'read')
    return <BsCheckAll size={16} className="text-sky-300" title="Read" />;
  return <BsCheckAll size={16} className="opacity-70" title="Sent" />;
}

export default function SentMessage({ time, message, customeStyle, status }) {
  const timeInHours = moment(new Date(time)).format("hh:mm A");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`bg-primary break-all max-w-full w-fit py-2 px-5 rounded-lg relative ${customeStyle}`}
      style={{ direction: 'rtl', wordWrap: 'break-word' }}
    >
      <div className="absolute top-0 right-0 w-0 h-0 border-solid border-transparent border-r-8 border-t-8 bg-primary"></div>
      <TextWithLinkChecker text={message} />
      <p dir="ltr" className="text-right text-sm pt-2 opacity-80 flex items-center justify-end gap-1">
        <span>{timeInHours}</span>
        <StatusTick status={status} />
      </p>
    </motion.div>
  );
}

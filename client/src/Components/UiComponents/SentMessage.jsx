
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


export default function SentMessage({ message, customeStyle }) {
  return (
    <div className={`bg-primary break-all max-w-full w-fit py-2 px-10 rounded-lg relative ${customeStyle}`} style={{ direction: 'rtl', wordWrap: 'break-word' }}>
      <div className="absolute top-0 right-0 w-0 h-0 border-solid border-transparent border-r-8 border-t-8 bg-primary"></div>
      <TextWithLinkChecker text={message} />
    </div>
  )
}

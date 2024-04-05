
export default function SentMessage({message,customeStyle}) {
  return (
    <div className={`bg-primary w-fit py-2 px-10 rounded-lg relative ${customeStyle}`} style={{direction:'ltr'}}>
      <div className="absolute top-0 right-0 w-0 h-0 border-solid border-transparent border-r-8 border-t-8 bg-primary"></div>
      {message}
    </div>
  )
}

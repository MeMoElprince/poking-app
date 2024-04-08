
export default function ReceivedMessage({message,customeStyle}) {
  return (
    <div className={`bg-background1 inline-flex flex-wrap max-w-full w-fit py-2 px-10 rounded-lg relative ${customeStyle}`} style={{direction:'rtl', wordWrap:'break-word'}}>
      <div className="absolute top-0 left-0 w-0 h-0 border-solid border-transparent border-r-8 border-t-8 bg-background1"></div>
      {message}
    </div>
  )
}

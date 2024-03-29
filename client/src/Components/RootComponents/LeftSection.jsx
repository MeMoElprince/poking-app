
export default function LeftSection({className=""}) {
  return (
    <div className={`border-r-2 border-background1 pt-5 px-10 ${className}`} style={{borderTopLeftRadius:'8px'}}>
      <h1 className="text-4xl font-bold">Chats</h1>
      <div className="mt-5 bg-background2">
        search
      </div>
    </div>
  )
}

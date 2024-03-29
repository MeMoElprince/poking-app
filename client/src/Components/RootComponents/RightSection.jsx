import Logo from '../../assets/logo.png';
export default function RightSection({ className = "" }) {

  const Empty = () => {
    return (
      <>
        <div></div>
        <div className='flex flex-col items-center text-center select-none pointer-events-none'>
          <img src={Logo} className='w-32' alt="logo" />
          <h1>WhoseApp</h1>
          <p className='w-[75%] text-gray'>
            WhatsApp for Windows
            Send and receive messages without keeping your phone online.
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
        <div>End-to-end encrypted</div>
      </>
    )
  }
  return (
    <div className={`flex flex-col justify-between items-center ${className}`}>
      <Empty />
    </div>
  )
}

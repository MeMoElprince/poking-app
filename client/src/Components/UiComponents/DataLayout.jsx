import logo from '../../assets/logo.png'
export default function DataLayout({children}) {
  return (
    <div className="flex justify-center items-center bg-background1 min-h-screen py-10">
      <div className='sm:w-[400px] w-[calc(100%-20px)] rounded-xl flex flex-col justify-center items-center text-xl text-white bg-background2'>
        <div className='flex justify-center items-center w-full text-center select-none pointer-events-none py-10'>
          <div className='space-y-4'>
            <img className='w-24' src={logo} alt={logo} />
            <h1>Poking App</h1>
          </div>
        </div>
        <div className='flex flex-col items-center w-full bg-[#2a2a2a] p-10 '>
          {children}
        </div>
      </div>
    </div>
  )
}

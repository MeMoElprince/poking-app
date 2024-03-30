import logo from '../../assets/logo.png'
import { useState } from 'react';
import Login from './Login';

export default function Signup() {
  const [Turn, setTurn] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);
  }
  if (Turn === 1) {
    return (
      <Login />
    )
  }
  return (
    <div className="flex justify-center items-center bg-background1 min-h-screen py-10">
      <div className='lg:w-[600px] sm:w-[400px] w-[calc(100%-20px)] rounded-xl flex flex-col justify-center items-center text-xl text-white bg-background2'>
        <div className='flex justify-center items-center w-full text-center select-none pointer-events-none py-4'>
          <div className='space-y-4'>
            <img className='w-24' src={logo} alt={logo} />
            <h1>WhosApp</h1>
          </div>
        </div>
        <div className='flex flex-col items-center w-full bg-[#2a2a2a] p-10 '>
          <form onSubmit={handleSubmit} className='flex flex-col space-y-10 w-full'>
            <div>
              <label htmlFor="Email" className='text-[#8000ff] text-[15px] font-bold'>Email</label>
              <div className='focus:border-b-primary border-b-primary border-b-2 pb-2'>
                <input type="email" name="Email" id="Email" placeholder="email@example.com" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
              </div>
            </div>
            <div>
              <label htmlFor="Password" className='text-[#8000ff] text-[15px] font-bold'>Password</label>
              <div className='focus:border-b-primary border-b-primary border-b-2 pb-2'>
                <input type="password" name="Password" id="Password" placeholder="Password" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
              </div>
            </div>
            <div>
              <label htmlFor="text" className='text-[#8000ff] text-[15px] font-bold'>User name</label>
              <div className='focus:border-b-primary border-b-primary border-b-2 pb-2'>
                <input type="text" name="text" id="text" placeholder="Your name" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
              </div>
            </div>
            <button className='text-center w-full bg-primary py-2 rounded-lg font-bold'>Create account</button>
          </form>
          <button className='cursor-pointer text-sm mt-10 border-b w-fit pb-1' onClick={()=>setTurn(1)}>Allready have account ?</button>
        </div>
      </div>
    </div>
  )
}

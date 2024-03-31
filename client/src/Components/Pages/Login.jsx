import { useState } from 'react';
import logo from '../../assets/logo.png'
import VarifyCode from './VarifyCode';
import { toast } from 'react-toastify';
import LoadingSpinner from '../UiComponents/LoadingSpinner'

export default function Login() {
  const [Turn, setTurn] = useState(1);
  const [Email, setEmail] = useState('');
  const [Loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if(Loading)return;
    setLoading(true);
    if (Email === '') {
      toast(' Email is required', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setTurn(2);
    console.log(Email);
  }
  const handleOnChange = (e) => {
    if(Loading)return;
    setEmail(e.target.value);
  }
  if (Turn === 2) {
    return (
      <VarifyCode />
    )
  }
  return (
    <div className="flex justify-center items-center bg-background1 min-h-screen py-10">
      <div className='sm:w-[400px] w-[calc(100%-20px)] rounded-xl flex flex-col justify-center items-center text-xl text-white bg-background2'>
        <div className='flex justify-center items-center w-full text-center select-none pointer-events-none py-10'>
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
                <input onChange={handleOnChange} value={Email} type="email" name="Email" id="Email" placeholder="email@example.com" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
              </div>
            </div>
            <button className={`text-center h-12 w-full bg-primary py-2 rounded-lg font-bold flex justify-center items-center  ${Loading?"opacity-20 cursor-not-allowed":""}`}>
              {Loading ? <LoadingSpinner /> : 'Send OTP code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

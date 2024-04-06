import { useState, useContext } from 'react';
import VarifyCode from './VarifyCode';
import { toast } from 'react-toastify';
import LoadingSpinner from '../UiComponents/LoadingSpinner'
import DataLayout from '../UiComponents/DataLayout';
import {UserCtx} from '../../Store/Context/UserContext'
import {VerifyEmail} from '../../Store/urls'
const url = VerifyEmail();


export default function Login() {
  const [Turn, setTurn] = useState(1);
  const {Email, setEmail} = useContext(UserCtx);
  const [Loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Loading) return;
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
    setLoading(true);
    try {
      const response = await fetch(url,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: Email
         }),
      });
      const data = await response.json();
      setLoading(false);
      if(data.status === 'success'){
        setTurn(2);  
      }else{
        toast(data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleOnChange = (e) => {
    if (Loading) return;
    setEmail(e.target.value);
  }
  if (Turn === 2) {
    return (
      <VarifyCode />
    )
  }
  return (
    <DataLayout>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-10 w-full'>
        <div>
          <label className='text-[#8000ff] text-[15px] font-bold'>Email</label>
          <div className='focus:border-b-primary border-b-primary border-b-2 pb-2'>
            <input onChange={handleOnChange} value={Email} type="email" name="Email" id="Email" placeholder="email@example.com" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
          </div>
        </div>
        <button className={`text-center text-lg h-12 w-full bg-primary py-2 rounded-lg font-bold flex justify-center items-center  ${Loading ? "opacity-20 cursor-not-allowed" : ""}`}>
          {Loading ? <LoadingSpinner /> : 'Send OTP code'}
        </button>
      </form>
    </DataLayout>
  )
}

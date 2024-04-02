import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../UiComponents/LoadingSpinner'
import { UserAuthCtx } from '../../Store/Context/UserAuthContext';
import DataLayout from '../UiComponents/DataLayout'
import {UpdateMe} from '../../Store/urls'
import Cookies from 'js-cookie';
const url = UpdateMe();


export default function UserData() {
  const { setLogedIn } = useContext(UserAuthCtx);
  const { Token } = useContext(UserAuthCtx);
  const {Name, setName} = useContext(UserAuthCtx);
  const [Loading, setLoading] = useState(false);
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (Loading) return;
    if (Name === '') {
      toast(' Name is required', {
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
    if (Name.length > 24) {
      toast(' Name Should be les than 24 characters', {
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
    // fetch here and set the user data
    try {
      setLoading(true);
      const response = await fetch(url,{
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Token}`,
        },
        body: JSON.stringify({ 
          name: Name,
         }),
      });
      const data = await response.json();
      setLoading(false);
      if(data.status === 'success'){
        setLogedIn(true);
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
        setLogedIn(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
  const handleOnChange = (e) => {
    if (Loading) return;
    setName(e.target.value);
  }
  return (
    <DataLayout>
      <form onSubmit={handleSubmit} className='flex flex-col space-y-10 w-full'>
        <div>
          <label className='text-[#8000ff] text-[15px] font-bold'>Name</label>
          <div className='focus:border-b-primary border-b-primary border-b-2 pb-2'>
            <input onChange={handleOnChange} value={Name} type="Name" name="Name" id="Name" placeholder="Enter your name" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
          </div>
        </div>
        <button className={`text-center text-lg h-12 w-full bg-primary py-2 rounded-lg font-bold flex justify-center items-center  ${Loading ? "opacity-20 cursor-not-allowed" : ""}`}>
          {Loading ? <LoadingSpinner /> : 'Confirm'}
        </button>
      </form>
    </DataLayout>
  )
}

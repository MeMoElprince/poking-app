import { useState, useRef, useEffect, useContext } from 'react';
import logo from '../../assets/logo.png'
import { motion } from 'framer-motion'
import { UserAuthCtx } from '../../Store/UserAuthContext';
import LoadingSpinner from '../UiComponents/LoadingSpinner'
import UserData from './UserData';
import DataLayout from '../UiComponents/DataLayout';

const OtpComponent = ({ Type, setType }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const { setLogedIn } = useContext(UserAuthCtx);
  const [color, setColor] = useState('#757575');
  const [Focused, setFocused] = useState(0);
  const [Loading, setLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(1);
  const inputRefs = useRef([]);
  // #ff5959 red
  // #757575 gray
  // #00ff80 green
  const handleFocus = (i = 0) => {
    for (; i < 6; i++) {
      if (otp[i] === '') {
        setFocused(i);
        return;
      }
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setColor('#ff5959');
    setSubmitClicked(prev => prev + 1);
    console.log(otp.join(''));
    // return;
    // fetch here and check if the otp is correct then check if the user is already in the database
    // if the user is already in the database then setLogedIn(true)
    // if the user is not in the database then setType(2)

    setType(2);
    // setLogedIn(true);
  }
  const handleChange = (e, num) => {
    // remove all spaces from e.target.value
    if (Loading) return;
    e.target.value = e.target.value.replace(/\s/g, '');
    setColor('#757575');
    if (!e.target.value) {
      // if backspace is pressed and the value is empty
      let temp = [...otp];
      temp[num] = '';
      setFocused(Math.max(num - 1, 0));
      setOtp(temp);
      return;
    } else if (e.target.value.length >= 2) {
      if (otp[num].length === 1 && e.target.value.length === 2) {
        let temp = [...otp];
        temp[num] = e.target.value[0] === otp[num] ? e.target.value[1] : e.target.value[0];
        setOtp(temp);
        if (temp[num]) handleFocus(num + 1)
        return;
      }


      // if user copy pasted the value
      let start = 0;
      let temp = [...otp];
      for (let i = num; i < 6; i++) {
        temp[i] = e.target.value[start];
        start++;
        if (start === e.target.value.length) break;
      }
      setOtp(temp);
      handleFocus(start)
      return;
    }


    for (let i = 0; i < 6; i++) {
      if (otp[i] === '') {
        let temp = [...otp];
        let n = e.target.value.length;
        temp[i] = e.target.value[n - 1];
        setOtp(temp);
        handleFocus(i + 1)
        return;
      }
    }
  }

  useEffect(() => {
    inputRefs.current[0].focus();
  }, [])

  useEffect(() => {
    inputRefs?.current[Focused]?.focus();
  }, [Focused])

  const myClass = `flex-grow border-[1px] border-[${color}] w-[40px] text-center outline-primary rounded-md bg-transparent py-3 font-bold`
  return (
    <form onSubmit={handleSubmit} className='flex flex-col space-y-10 w-full'>
      <div>
        <label className='text-[#8000ff] text-[15px] font-bold'>Enter Code</label>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: [-20, 0, 20, 0] }}
          transition={{ duration: 0.1 }}
          key={submitClicked}
          className='flex flex-wrap gap-2 mt-5 items-center'>
          {
            [0, 1, 2, 3, 4, 5].map((ele, key) => {
              return (
                <input key={key} ref={(item) => (inputRefs.current[ele] = item)}
                  onChange={(e) => handleChange(e, ele)}
                  value={otp[ele]} type="text" className={myClass} />
              )
            })
          }
        </motion.div>
      </div>
      <button className={`text-center text-lg h-12 w-full bg-primary py-2 rounded-lg font-bold flex justify-center items-center  ${Loading ? "opacity-20 cursor-not-allowed" : ""}`}>
        {Loading ? <LoadingSpinner /> : 'Confirm email'}
      </button>
    </form>

  )
}

export default function VarifyCode() {
  const [Type, setType] = useState(1);
  if (Type === 2) {
    return <UserData />
  }
  return (
    <DataLayout>
      <OtpComponent Type={Type} setType={setType} />
    </DataLayout>
  )
}

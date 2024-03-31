import { useState, useRef, useEffect, useContext } from 'react';
import logo from '../../assets/logo.png'
import { motion } from 'framer-motion'
import { UserAuthCtx } from '../../Store/UserAuthContext';
// <input type="email" name="Email" id="Email" placeholder="" className='w-full bg-transparent outline-none border-none text-sm text-[#c286ff]' />
const OtpComponent = ({ Turn, setTurn }) => {
  const [color, setColor] = useState('#757575');
  const { setLogedIn } = useContext(UserAuthCtx);
  const [submit, setSubmit] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(1);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [Focused, setFocused] = useState(0);
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
    setColor('#ff5959');
    setSubmitClicked(prev => prev + 1);
    setLogedIn(true);
  }
  const handleChange = (e, num) => {
    // remove all spaces from e.target.value
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
        if(start === e.target.value.length) break;
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
        <label htmlFor="Email" className='text-[#8000ff] text-[15px] font-bold'>Enter Code</label>
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
      <button className='text-center w-full bg-primary py-2 rounded-lg font-bold'>Confirm email</button>
    </form>

  )
}

export default function VarifyCode() {
  const [Turn, setTurn] = useState(2);

  if (Turn === 1) {
    // console.log(2);
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
          <OtpComponent Turn={Turn} setTurn={setTurn} />
        </div>
      </div>
    </div>
  )
}

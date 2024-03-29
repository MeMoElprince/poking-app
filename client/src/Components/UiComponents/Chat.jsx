import { useEffect, useRef, useState} from 'react';
import Person from '../../assets/Person.svg';

export default function Chat({ Img, Title, Message, Time, Counter }) {
  const [Width, setWidth] = useState(window.innerWidth>=768?100:100);

  console.log(Width);
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth>=768?100:100);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])
  return (
    <div className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[60px] h-[60px] flex justify-center items-center rounded-full bg-[#414141]">
        <img className="w-2/3" src={Person} alt="" />
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className={`flex flex-col justify-between overflow-hidden`}>
          <div className='mytruncate' title={Title}>{Title}</div>
          <div className='mytruncate text-[#BBBBBB]' title={Message}>{Message}</div>
        </div>
        <div className="flex flex-col justify-between items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
          <div className="text-primary w-[70px]">{Time}</div>
          <div className="rounded-full text-center bg-primary text-black w-[40px] ">
            {Counter > 99 ? "99+" : Counter}
          </div>
        </div>
      </div>
    </div>
  )
}

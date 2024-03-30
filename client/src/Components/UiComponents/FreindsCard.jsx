import Person from '../../assets/Person.svg';
import { useContext } from 'react';
import { FreindsCtx } from '../../Store/FreindsContext';

export default function Freinds({ Img, Title, Message, Time, Counter }) {
  const { FreindsWith, setFreindsWith, setRightSectionActive } = useContext(FreindsCtx);
  const handleClick = () => {
    setRightSectionActive(true);
    setFreindsWith({ Img, Title, Message, Time, Counter });
  }
  return (
    <div onClick={handleClick} className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[60px] h-[60px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141]" style={{background:Person}}>
        <img className="w-full h-full" src={Img} alt="" />
        {/* <img className="w-2/3 h-full" src={Person} alt="" /> */}
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className={`flex flex-col justify-between overflow-hidden`}>
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
          <div className='mytruncate text-[#BBBBBB]' title={Message}>{Message}</div>
        </div>
        <div className="flex flex-col justify-between items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
          <div className="text-primary w-[71px] font-bold">{Time}</div>
          <div className="rounded-full text-center font-bold bg-primary text-black w-[40px] ">
            {Counter > 99 ? "99+" : Counter}
          </div>
        </div>
      </div>
    </div>
  )
}

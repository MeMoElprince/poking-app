import Person from '../../assets/Person.svg';
import { CiSquarePlus } from "react-icons/ci";

export default function AddFrinedCard({ Img='a', Title='a', Message='a', Time='a', Counter='a' }) {
  return (
    <div className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[60px] h-[60px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141]" style={{background:Person}}>
        <img className="w-full h-full" src={Img} alt="" />
        {/* <img className="w-2/3 h-full" src={Person} alt="" /> */}
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className={`flex flex-col justify-center overflow-hidden`}>
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
        </div>
        <div className="flex flex-col justify-center items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
          <CiSquarePlus className="text-primary cursor-pointer" size={30} />
        </div>
      </div>
    </div>
  )
}

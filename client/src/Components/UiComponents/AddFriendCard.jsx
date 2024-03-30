import Person from '../../assets/Person.svg';
import { CiSquarePlus } from "react-icons/ci";

export default function AddFrinedCard({ Img, Title }) {

  const handleAddFrined = ()=>{
    console.log('Frined Added');
  }
  return (
    <div className="flex gap-5 hover:bg-[#383838] p-2 rounded-lg select-none">
      <div className="min-w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{background:Person}}>
        <img className="w-full h-full" src={Img} alt="" />
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className={`flex flex-col justify-center overflow-hidden`}>
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
        </div>
        <div onClick={handleAddFrined} title='Add this user' className="flex flex-col justify-center items-end absolute right-0 rounded-xl w-[80px] z-10  h-full">
          <CiSquarePlus className="text-primary cursor-pointer" size={30} />
        </div>
      </div>
    </div>
  )
}

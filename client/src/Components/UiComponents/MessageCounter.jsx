
export default function MessageCounter({counter}) {
  if(!counter) return null;
  return (
    <div className='absolute w-[40px] h-[30px] rounded-full text-black font-bold top-1 -right-0 border-2 border-background2 bg-primary flex justify-center items-center text-center'>
      {counter>=100 ? '99+' : counter}
    </div>
  )
}

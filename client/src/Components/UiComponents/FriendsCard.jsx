/* eslint-disable react/prop-types */
import Person from '../../assets/Person.svg';
import { useContext } from 'react';
import moment from 'moment';
import { FriendsCtx } from '../../Store/Context/FriendsContext';
import { PresenceCtx } from '../../Store/Context/PresenceContext';

export default function Friends({ Img, id, Title, Message, Time, Counter, room, LastSeen }) {
  const { setFriendsWith, setRightSectionActive } = useContext(FriendsCtx);
  const { isOnline } = useContext(PresenceCtx);
  const online = isOnline(id);

  const handleClick = () => {
    if (window.innerWidth < 900)
      setRightSectionActive(true);
    setFriendsWith({ Img, Title, Message, Time, Counter, id, room, lastSeen: LastSeen });
  }

  // Time may be a timestamp/Date (lastMessageAt) — show a friendly short label
  const timeLabel = Time ? moment(new Date(Time)).calendar(null, {
    sameDay: 'h:mm A',
    lastDay: '[Yesterday]',
    lastWeek: 'ddd',
    sameElse: 'DD/MM/YY'
  }) : '';

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
      className="flex gap-5 hover:bg-[#383838] active:scale-[0.99] transition-all duration-150 p-2 rounded-lg select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60"
    >
      <div className="relative min-w-[50px] h-[50px]">
        <div className="w-full h-full flex justify-center items-center rounded-full overflow-hidden bg-[#414141] imgPlaceholder" style={{ background: Person }}>
          {Img !== 'default.jpg' &&
            <img className="w-full h-full" src={Img} alt={Title} />
          }
        </div>
        {online && <span className="online-dot" title="Online" />}
      </div>
      <div className="flex flex-grow gap-2 relative overflow-hidden">
        <div className="flex flex-col justify-between overflow-hidden flex-grow">
          <div className='mytruncate font-bold' title={Title}>{Title}</div>
          <div className='mytruncate text-[#BBBBBB]' title={Message}>{Message || (online ? 'online' : '')}</div>
        </div>
        <div className="flex flex-col justify-center items-end gap-1 shrink-0 z-10">
          {timeLabel && <span className="text-[11px] text-gray whitespace-nowrap">{timeLabel}</span>}
          {Counter ? (
            <span className="rounded-full text-center text-xs font-bold bg-primary text-black min-w-[20px] px-1.5">
              {Counter > 9 ? '9+' : Counter}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

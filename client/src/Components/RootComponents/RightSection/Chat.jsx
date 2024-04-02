import ReceivedMessage from '../../UiComponents/ReceivedMessage';
import SentMessage from '../../UiComponents/SentMessage';
import { useRef, useEffect } from 'react';
const messages = [
  {type: 'sent', message: 'Hello', id: 1},
  {type: 'received', message: 'Hi', id: 2},
  {type: 'sent', message: 'How are you?', id: 3},
  {type: 'received', message: 'I am fine', id: 4},
  {type: 'sent', message: 'Good to hear that', id: 5},
  {type: 'received', message: 'How about you?', id: 6},
  {type: 'sent', message: 'I am also fine', id: 7},
  {type: 'received', message: 'Okay', id: 8},
  {type: 'sent', message: 'What have you been up to lately?', id: 9},
  {type: 'received', message: 'Not much, just working on some projects', id: 10},
  {type: 'sent', message: 'That sounds interesting. What kind of projects?', id: 11},
  {type: 'received', message: 'Mainly software development stuff', id: 12},
  {type: 'sent', message: 'Ah, I see. Do you enjoy it?', id: 13},
  {type: 'received', message: 'Yeah, its challenging but rewarding', id: 14},
  {type: 'sent', message: 'Im glad to hear that. Ive been thinking about starting a new project myself', id: 15},
  {type: 'received', message: 'Thats exciting! What kind of project are you considering?', id: 16},
  {type: 'sent', message: 'Im thinking of building a mobile app', id: 17},
  {type: 'received', message: 'That sounds ambitious. What will it do?', id: 18},
  {type: 'sent', message: 'Im still brainstorming ideas, but I want it to be something useful and fun', id: 19},
  {type: 'received', message: 'Well, let me know if you need any help brainstorming or developing it', id: 20},
  {type: 'sent', message: 'Thanks, I appreciate that. I might take you up on that offer', id: 21},
];
export default function Chat() {
  const chatRef = useRef();

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  },[])
  return (
    <div ref={chatRef} className='px-4 overflow-auto space-y-5 h-full py-5'>
      {messages.map(e=>{
        return(
          e.type === 'sent' ? 
          <div key={e.id} style={{direction:'rtl'}}>
            <SentMessage message={e.message} /> 
          </div>
          : 
          <div key={e.id} style={{direction:'ltr'}}>
            <ReceivedMessage message={e.message} />
          </div>
        )
      })}
    </div>
  )
}

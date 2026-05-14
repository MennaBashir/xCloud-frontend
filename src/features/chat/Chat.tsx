import { Link } from 'react-router-dom'
import ModelChat from './components/ModelChat'
import { images } from '@/shared/assets'

function Chat() {
  return (
    <div className='container px-4 mx-auto mt-16'>
        <div>
            <Link to='/app' className='flex items-center mb-6 group'>
            <img src={images.arrowRight} alt='arrow right' className='inline w-6 h-6 mr-3 transition-transform duration-200 group-hover:-translate-x-1' />
               <h4 className='font-bold text-2xl text-skyblue-950'>
                 AI Chat
               </h4>
            </Link>
        </div>
        
        <ModelChat />
    </div>
  )
}

export default Chat
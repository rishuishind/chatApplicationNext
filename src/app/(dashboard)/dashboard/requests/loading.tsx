import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const loading = () => {
  return (
    <div className='flex w-full flex-col gap-3'>
        <Skeleton className=' mb-4 rounded-l' height={60} width={500}/>
        <Skeleton className=' mb-4 rounded-l' height={50} width={350}/>
        <Skeleton className=' mb-4 rounded-l' height={50} width={350}/>
        <Skeleton className=' mb-4 rounded-l' height={50} width={350}/>
    </div>
  )
}

export default loading
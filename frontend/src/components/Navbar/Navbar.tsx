import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='absolute top-0 left-0 w-full mt-16 px-8 flex' style={{justifyContent: 'space-between'}}>
        <div className='flex flex-col uppercase tracking-wide'>
            <Link to='/' className="py-1 px-8 text-white py-2 px-4"> Powerbites </Link>
            <Link to='/dashboard' className="py-1 px-8 text-white py-2 px-4"> Extras Resources </Link>
        </div>
        <div className='flex flex-col uppercase tracking-wide'>
            <Link to='/' className="py-1 px-8 text-white py-2 px-4"> Admin </Link>
            <Link to='/dashboard' className="py-1 px-8 text-white py-2 px-4"> Search Keyword </Link>
        </div>
    </nav>
  )
}

export default Navbar

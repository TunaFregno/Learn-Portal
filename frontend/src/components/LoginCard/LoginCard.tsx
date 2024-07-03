import { Link } from 'react-router-dom';
import MainCard from '../MainCard/MainCard';
import logo from '../../assets/images/Logo.png';
import './LoginCard.css';

const LoginCard = () => {
  return (
    <MainCard>
        <div className="flex flex-row h-full text-white">
            <div className="flex justify-center w-10/12">
                <img src={logo} alt="Logo" className="h-28 w-24 mt-16" />
            </div>
            <div className="flex flex-col mono">
                <div className="LoginTitle ">
                    YOUR PATH <br /> TO TECH
                </div>
                <div className="w-9/12 mt-10 tracking-wide uppercase text-sm leading-6">
                    Welcome to TechTrain Hub, your premier destination for mastering web, client, and server technologies. Whether you're a beginner or an experienced professional, our curated trainings and resources empower you to delve deeper into web development, client-side scripting, and server management.
                </div>
                <div className="flex space-x-4 text-white mt-10">
                <Link 
                    to='/'
                    className="rounded-full py-2 px-8 border bg-gray-50/10 text-white py-2 px-4">
                    Admin
                </Link>
                <Link 
                    to='/dashboard'
                    className="rounded-full py-2 px-8 border bg-gray-50/10 text-white py-2 px-4">
                    Explore
                </Link>
                </div>
            </div>
        </div>
    </MainCard>
  )
}

export default LoginCard

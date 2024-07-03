import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainCard from '../components/MainCard/MainCard';
import dashboardIcon from '../assets/images/Icon.png';

const MainPage = () => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const handleClick = () => {
        if (!isSelected) {
            setIsSelected(true);
        } else {
            setIsSelected(false);
        }
        
    };

    return (
        <div className="absolute w-full h-full flex flex-col items-center justify-center">
            <h1 className='LoginTitle mt-16 mb-16' style={{WebkitTextFillColor: 'transparent'}}>WEB</h1>
            {isSelected ? (
                <div className="w-8/12 text-white flex items-center justify-center ">
                    <span className="text-white uppercase absolute w-4/12 left-0 px-16">
                        uncover the intricacies of how the web functions. 
                        learn about the lifecycle of a web request, By understanding these core concepts, 
                        you'll gain a deep appreciation of the web's underlying framework and how various components interact to 
                        deliver seamless online experiences.
                    </span>
                    <MainCard width='w-569' heigth='h-435'>
                        <img src={dashboardIcon} alt="Logo" className="w-96"  />
                    </MainCard>
                    <div className="absolute w-569 border-b border-white right-0" >
                        <span className="py-1 px-8 text-white py-2 px-4 cursor-pointer" onClick={handleClick}> BACK </span>
                        <Link to='/categories' className="py-1 px-8 text-white py-2 px-4"> NEXT </Link>
                    </div>
                </div>
            ) : (
                <div className="w-8/12 text-white flex items-center justify-evenly ">
                    <img src={dashboardIcon} alt="Logo" className="w-60 opacity-25" />
                    <img src={dashboardIcon} alt="Logo" className="w-96 cursor-pointer" onClick={handleClick}/>
                    <img src={dashboardIcon} alt="Logo" className="w-60 opacity-25" />
                </div>
            )}
        </div>
    )
}

export default MainPage

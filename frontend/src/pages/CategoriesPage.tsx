import MainCard from '../components/MainCard/MainCard';

const CategoriesPage = () => {
    const categories = ['100', '200', '300', '400', '500', '600']

    return (
        <div className="absolute w-full h-full flex flex-col items-center">
            <h1 className='LoginTitle mt-16 mb-8' style={{WebkitTextFillColor: 'transparent'}}>WEB</h1>
            <div className="w-full text-white flex items-center justify-evenly flex-wrap px-24 text-4xl">
                {categories.map((category, index) => (
                    <MainCard key={index} width="w-380" heigth="h-60" mb='mb-14' >
                        {category}
                    </MainCard>
                ))}
            </div>        
        </div>
    )
}

export default CategoriesPage

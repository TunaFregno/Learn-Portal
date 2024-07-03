const MainCard = ({ children, heigth = 'h-527', width = 'w-1024', position= 'static', mb='mb-0' }) => {
  return (
    <div className={`${heigth} ${width} ${position} ${mb} flex flex-col justify-center items-center bg-gray-50/10 drop-shadow-xl border rounded-custom border-custom-gray`}>
        {children}
    </div>
  )
}

export default MainCard

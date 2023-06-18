

const Header = () => {

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <a href="/" className='font-bold text-white text-2xl cursor-pointer'>AIDU</a>
                </div>
            </nav>
            
        </header>
    )
}

export default Header
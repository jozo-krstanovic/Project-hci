import Image from 'next/image';

const Logo = () => {
    return (
        <div className='flex items-center justify-center'>
            <Image 
                src={"/assets/palestra-light.png"}
                width={50}
                height={42}
                alt=''
            />
            <span className='font-ubuntu font-bold text-[32px]'>Palestra</span>
        </div>
    );
}

export default Logo;
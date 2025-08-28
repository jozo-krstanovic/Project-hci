import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
    return (
        <Link href="/" className='flex items-center justify-center'>
            <Image 
                src={"/assets/palestra-light.png"}
                width={50}
                height={42}
                alt=''
            />
            <span className='font-ubuntu font-bold text-[32px]'>Palestra</span>
        </Link>
    );
}

export default Logo;
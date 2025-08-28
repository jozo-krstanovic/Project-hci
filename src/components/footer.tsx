import Logo from "./logo";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-brand-black px-[20px] sm:px-[100px] py-[50px] flex flex-col items-start">
      <div className="my-[25px]">
        <Logo />
      </div>
      <div className="flex flex-wrap justify-center sm:justify-between w-full sm:text-left">
        <div className="w-full sm:w-[300px] mx-[10px] my-4">
          <h2 className="text-[28px]">About us</h2>
          <p className="text-[12px] font-montserrat">Palestra is more than a gym—it’s a community. With top-tier equipment, expert trainers, and a welcoming atmosphere, we help you stay strong, motivated, and on track with your fitness journey</p>
        </div>
        <div className="w-full sm:w-[300px] mx-[10px] my-4">
          <h2 className="text-[28px]">Sitemap</h2>
          <div className="flex flex-col">
            <span className="font-montserrat text-[16px]">Progress</span>
            <span className="font-montserrat text-[16px]">Programs</span>
            <span className="font-montserrat text-[16px]">Health & Wellness</span>
            <span className="font-montserrat text-[16px]">Community</span>
          </div>
        </div>
        <div className="w-full sm:w-[300px] mx-[10px] my-4">
          <h2 className="text-[28px]">Follow us</h2>
          <div className="flex">
            <div className="mr-[10px]">
              <Image
                src={"/assets/youtube-icon.png"}
                width={48}
                height={48}
                alt="YouTube" />
            </div>
            <div className="mr-[10px]">
              <Image
                src={"/assets/instagram-icon.png"}
                width={48}
                height={48}
                alt="Instagram" />
            </div>
            <div className="mr-[10px]">
              <Image
                src={"/assets/tiktok-icon.png"}
                width={48}
                height={48}
                alt="TikTok" />
            </div>
          </div>
        </div>
        <div className="w-full sm:w-[300px] mx-[10px] my-4">
          <h2 className="text-[28px]">Contact us</h2>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Image 
                src={"/assets/email-icon.png"}
                width={28}
                height={28}
                alt="Email"
                />
              <p className="font-montserrat text-[12px] ml-[10px]">contact@example.com</p>
            </div>
            <div className="flex items-center">
              <Image 
                src={"/assets/phone-icon.png"}
                width={28}
                height={28}
                alt="Phone"
                />
              <p className="font-montserrat text-[12px] ml-[10px]">+385 987 6543 21</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
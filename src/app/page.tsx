import FeaturePreview from "../components/featurePreview";
import Logo from "../components/logo";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full px-4 sm:px-10 md:px-[178px] py-10 sm:py-[120px]">
        <div className="py-[10px] absolute inset-0 bg-[url('/assets/hero-image.jpg')] bg-cover bg-center filter brightness-50"></div>
        <h1 className="py-[10px] text-center sm:text-left text-white font-bold text-[48px] md:text-[64px] relative">Get Stronger <br></br> Feel Better</h1>
        <p className="py-[10px] text-center sm:text-left text-white font-montserrat text-[20px] relative">
          Your journey starts here.<br /> 
          Top equipment, expert trainers,<br /> 
          and a community that pushes you further
        </p>
        <button className="block mx-auto sm:mx-0 text-center sm:text-left bg-brand-fill font-montserrat text-brand-text-strong text-[16px] relative px-[30px] py-[15px] font-bold rounded-[5px]">
          Join Now
        </button>
      </div>

      {/* Features Section */}
      <div className="bg-brand-fill py-[10px] sm:py-[100px] text-black flex flex-col items-center min-h-[578px]">
        <h1 className="text-center sm:text-left text-[48px] md:text-[64px] py-[60px]">Why Choose Palestra?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full py-[10px] sm:py-[60px]">
          <FeaturePreview imgSource="/assets/weights-image.jpg" title="Modern Equipment" content="Train with the best gear for strength, endurance, and flexibility" />
          <FeaturePreview imgSource="/assets/expert-image.jpg" title="Expert Trainers" content="Get personalized guidance from certified professionals" />
          <FeaturePreview imgSource="/assets/community-image.jpg" title="Motivating Community" content="Surround yourself with like minded people who push you to be your best" />
          <FeaturePreview imgSource="/assets/clock-image.jpg" title="24/7 Access" content="Workout on your schedule, anytime, day or night" />
          <FeaturePreview imgSource="/assets/todo-image.jpg" title="Training Programs" content="Surround yourself with like minded people who push you to be your best" />
          <FeaturePreview imgSource="/assets/smiley-image.jpg" title="A Space for Everyone" content="Whether you're a beginner or a pro, you'll feel at home here" />
        </div>
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left h-auto my-[40px]">
          <h1 className="text-[32px] px-[25px]">What are you waiting for?</h1>
          <button className="text-dark px-[30px] py-[15px] border-solid border-[5px] border-black rounded-[5px] font-montserrat font-bold flex items-center justify-center">Join Now</button>
        </div>
      </div>

      {/* Footer Section */}
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
    </>
  );
}
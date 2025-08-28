import { JoinNowButton } from "@/components/JoinNowButton";
import FeaturePreview from "@/components/featurePreview";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full px-4 sm:px-10 md:px-[178px] py-10 sm:py-[120px]">
        <div className="py-[10px] absolute inset-0 bg-[url('/assets/hero-image.jpg')] bg-cover bg-center filter brightness-[0.4]"></div>
        <h1 className="py-[10px] text-center sm:text-left text-white font-bold text-[48px] md:text-[64px] relative">Get Stronger <br></br> Feel Better</h1>
        <p className="py-[10px] text-center sm:text-left text-white font-montserrat text-[20px] relative">
          Your journey starts here.<br />
          Top equipment, expert trainers,<br />
          and a community that pushes you further
        </p>
        <JoinNowButton className="mx-auto sm:mx-0 text-center font-montserrat sm:text-left text-[16px] relative px-[30px] py-[15px] font-bold rounded-[5px]" />
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
          <JoinNowButton className="px-[30px] py-[15px] font-montserrat font-bold flex items-center justify-center" />
        </div>
      </div>
    </>
  );
}
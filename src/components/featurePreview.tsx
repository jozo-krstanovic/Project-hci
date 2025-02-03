import Image from "next/image";

type FeatureProps = {
    imgSource: string,
    title: string,
    content: string
}

const FeaturePreview = ({ imgSource, title, content }: FeatureProps) => {
    return (
    <>
        <div className="flex justify-start sm:justify-center mx-[20px] sm:mx-[0px] min-h-[100px] sm:min-h-auto">
            <div className="py-[8px]">
                <Image
                src={imgSource}
                width={64}
                height={64}
                alt=""
                />
            </div>
            <div className="text-black px-[10px]">
                <h2 className="text-[24px]">{title}</h2>
                <p className="w-[240px] text-[16px] font-montserrat">{content}</p>
            </div>
        </div>
    </>
    );
}

export default FeaturePreview;
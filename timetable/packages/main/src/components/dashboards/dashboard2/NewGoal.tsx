import { Progress } from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';
import img1 from '/src/assets/images/backgrounds/top-info-shape.png';
import avtar from '/src/assets/images/svgs/icon-idea.svg';
const NewGoal = () => {
  return (
    <div>
      <CardBox className="bg-lightprimary dark:bg-lightprimary overflow-hidden">
        <div className={`h-12 w-12 rounded-full flex justify-center items-center bg-primary`}>
          <img src={avtar} className="h-6 w-6" alt="image" />
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-base">New Goals</h6>
            <p className="text-primary ">83%</p>
          </div>
          <Progress progress={80} color="primary" size={'md'} />
        </div>
        <img
          src={img1}
          className="absolute top-0 end-0 rtl:transform rtl:scale-x-[-1]"
        />
      </CardBox>
    </div>
  );
};

export default NewGoal;

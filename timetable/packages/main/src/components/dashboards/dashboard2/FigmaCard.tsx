import CardBox from 'src/components/shared/CardBox';
import bg from 'src/assets/images/backgrounds/gifts.png';

import user1 from '/src/assets/images/profile/user-2.jpg';
import user2 from '/src/assets/images/profile/user-3.jpg';
import user3 from '/src/assets/images/profile/user-4.jpg';
import user4 from '/src/assets/images/profile/user-5.jpg';

const FigmaCard = () => {
  const userImg = [
    {
      user: user1,
    },
    {
      user: user2,
    },
    {
      user: user3,
    },
    {
      user: user4,
    },
  ];
  return (
    <>
      <CardBox className="overflow-hidden p-0">
        <div className="bg-lighterror flex justify-center py-5 px-6">
          <img src={bg} alt="image" />
        </div>
        <div className="px-6 pt-3 pb-6 flex flex-col gap-3">
          <h5 className="text-base font-semibold">Figma Tips and Tricks with Stephan</h5>
          <p className="text-sm">Checkout latest events going to happen in USA.</p>
          <div className="flex">
            {userImg.map((item, index) => (
              <div className="-ms-2  h-10 w-10" key={index}>
                <img
                  src={item.user}
                  className="border-2 border-white dark:border-darkborder rounded-full"
                  alt="icon"
                />
              </div>
            ))}
            <div className="-ms-2 ">
              <div className="bg-lightinfo border-2 border-white dark:border-darkborder  h-10 w-10 flex justify-center items-center text-secondary rounded-full dark:bg-lightinfo">
                +8
              </div>
            </div>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default FigmaCard;

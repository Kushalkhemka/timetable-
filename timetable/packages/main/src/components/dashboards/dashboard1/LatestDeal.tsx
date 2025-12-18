import { Progress } from 'flowbite-react';
import { Badge } from 'src/components/shadcn-ui/Default-Ui/badge';
import CardBox from 'src/components/shared/CardBox';

import user1 from '/src/assets/images/profile/user-2.jpg';
import user2 from '/src/assets/images/profile/user-3.jpg';
import user3 from '/src/assets/images/profile/user-4.jpg';
import user4 from '/src/assets/images/profile/user-5.jpg';

const LatestDeal = () => {
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
      <CardBox>
        <div className="flex justify-between align-baseline">
          <div>
            <h5 className="card-title">Latest Deal</h5>
            <p className="card-subtitle">Last 7 days</p>
          </div>
          <div className="mt-2">
            <Badge variant="outlineSuccess" className="bg-lightsuccess">
              86.5%
            </Badge>
          </div>
        </div>
        <div className="my-6">
          <div className="flex items-center justify-between mb-2">
            <h6 className="text-base">$98,500</h6>
            <h6 className="text-base">$1,22,900</h6>
          </div>
          <Progress progress={80} color="primary" size={'md'} />
          <p className="text-darklink text-sm mt-2 font-medium">Coupons used: 18/22</p>
        </div>

        <h5 className="text-sm mb-2">Recent Purchasers</h5>
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
      </CardBox>
    </>
  );
};

export default LatestDeal;

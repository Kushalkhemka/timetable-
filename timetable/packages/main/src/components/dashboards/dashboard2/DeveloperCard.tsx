import CardBox from 'src/components/shared/CardBox';
import user1 from '/src/assets/images/profile/user-3.jpg';
const DeveloperCard = () => {
  return (
    <div>
      <CardBox>
        <div className="flex justify-between">
          <img src={user1} className="h-15 w-15 rounded-full" />
          <h6 className="text-warning ">#1 in DevOps</h6>
        </div>
        <div className='mt-4'>
          <h5 className="card-title">Adam Johnson</h5>
          <p className="card-subtitle">Top Developer</p>
        </div>
      </CardBox>
    </div>
  );
};

export default DeveloperCard;

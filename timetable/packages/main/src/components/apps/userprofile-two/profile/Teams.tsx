import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react';
const Teams = () => {
  const TeamsData = [
    {
      icon: 'tabler:brand-github',
      title: 'Backend Developer',
      subtitle: '120 members',
      color: 'primary',
    },
    {
      icon: 'tabler:brand-react',
      title: 'React Developer',
      subtitle: '86 members',
      color: 'info',
    },
  ];
  return (
    <>
      <CardBox>
        <h5 className="card-title mb-2">Teams</h5>
        <div className="flex flex-col gap-5">
          {TeamsData.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              <span
                className={`h-10 w-10 rounded-full flex items-center justify-center  bg-light${item.color} dark:bg-dark${item.color} text-${item.color}`}
              >
                <Icon icon={item.icon} height={20} />
              </span>
              <div>
                <h4 className="text-sm">{item.title}</h4>
                <p className="font-medium">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBox>
    </>
  );
};

export default Teams;

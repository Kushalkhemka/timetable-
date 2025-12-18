// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import CardBox from '../../components/shared/CardBox';
import { Button } from 'flowbite-react';
const variants = [
  { label: 'Error', className: 'before:bg-lighterror text-error hover:bg-lighterror hover:text-error'  },
  { label: 'Success', className: 'before:bg-lightsuccess text-success hover:bg-lightsuccess hover:text-success' },
  { label: 'Warning', className: 'before:bg-lightwarning text-warning hover:bg-lightwarning hover:text-warning' },
  { label: 'indigo', className: 'before:bg-lightindigo text-indigo' },
  { label: 'info', className: 'before:bg-lightinfo text-info hover:bg-lightinfo hover:text-info' },
  { label: 'secondary', className: 'before:bg-lightsecondary text-secondary hover:bg-lightsecondary hover:text-secondary' },
];

const SamplePage = () => {
  return (
    <CardBox>
    <h5 className="card-title">Sample page</h5>
    <p>
      Lorem Ipsum is simply dummy text of the printing and typesetting
      industry. Lorem Ipsum has been the industry's standard dummy text ever
      since the 1500s
    </p>

   <div className=" flex-wrap gap-4 hidden">
      {variants.map(({ label, className }) => (
        <Button key={label} className={className}>
          {label}
        </Button>
      ))}
    </div>


  </CardBox>
  );
};

export default SamplePage;



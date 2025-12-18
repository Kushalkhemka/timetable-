// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import CardBox from '../../components/shared/CardBox';
import { Button } from 'flowbite-react';
import Toaster from '../toaster';
import FeatureBento from '../../components/feature/FeatureBento';
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
    <>
      <Toaster />
    <CardBox>
      <FeatureBento />
    </CardBox>
   </>
  );
};

export default SamplePage;



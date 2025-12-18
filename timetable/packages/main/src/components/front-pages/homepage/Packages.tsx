import { Icon } from '@iconify/react/dist/iconify.js';
import { Badge, Button } from 'flowbite-react';
export const Packages = () => {
  const Licenses = [
    {
      key: 'license1',
      licenseType: 'Single Use',
      licenseDesc: 'Use for single end product which end users can’t be charged for.',
      price: '$49',
      isSaasUse: false,
      feature: 'One Project',
      isPopular: false,
    },
    {
      key: 'license2',
      licenseType: 'Multiple Use',
      licenseDesc: 'Use for unlimited end products end users can’t be charged for.',
      price: '$89',
      isSaasUse: false,
      feature: 'Unlimited Project',
      isPopular: false,
    },
    {
      key: 'license3',
      licenseType: 'Extended Use',
      licenseDesc: 'Use for single end product which end users can be charged for.',
      price: '$299',
      isSaasUse: true,
      feature: 'One Project',
      isPopular: true,
    },
    {
      key: 'license4',
      licenseType: 'Unlimited Use',
      licenseDesc: 'Use in unlimited end products end users can be charged for.',
      price: '$499',
      isSaasUse: true,
      feature: 'Unlimited Project',
      isPopular: false,
    },
  ];
  return (
    <>
      <div className="dark:bg-dark">
        <div className="container mx-auto lg:pt-24 pt-12">
          <div className="flex w-full justify-center mb-12">
            <div className="text-center">
              <h2 className="sm:text-44 text-3xl font-bold leading-[48px]! text-dark dark:text-white text-center">
                Fair pricing for everyone.
              </h2>
              <p className="text-17 leading-[32px] pt-4 text-darklink">
                Our robust analytics offer rich insights into the information buyers want, informing
                where teams.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {Licenses.map((item, index) => {
              return (
                <div className="xl:col-span-3 md:col-span-6 col-span-12" key={index}>
                  <div className="p-6 rounded-lg border border-ld">
                    <div className="pb-8">
                      <h6 className="text-xl font-semibold text-ld mb-4 flex items-center gap-2">
                        {item.licenseType}
                        {item.isPopular ? (
                          <Badge
                            color={'lightprimary'}
                            className="text-xs font-bold rounded-full"
                            size={'small'}
                          >
                            Popular
                          </Badge>
                        ) : null}
                      </h6>
                      <p className=" leading-[24px] text-sm ">{item.licenseDesc}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-40 leading-tight font-bold text-primary">
                        {item.price}
                      </div>
                      <p className="text-base self-end  relative -top-1">/ one time pay</p>
                    </div>
                    <div className="mt-8 flex flex-col gap-3.5">
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:circle-check" className="text-xl text-primary" />
                        <p className="text-sm text-ld font-medium ">Full source code</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon icon="tabler:circle-check" className="text-xl text-primary" />
                        <p className="text-sm text-ld font-medium ">Documentation</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isSaasUse ? (
                          <>
                            <Icon icon="tabler:circle-check" className="text-xl text-primary " />
                            <p className="text-sm text-ld font-medium ">Use in SaaS app</p>
                          </>
                        ) : (
                          <>
                            <Icon icon="tabler:circle-x" className="text-xl text-error" />
                            <p className="text-sm  font-medium  ">Use in SaaS app</p>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-ld flex items-center gap-2 font-medium ">
                          <Icon icon="tabler:circle-check" className="text-xl text-primary " />
                          {item.feature === 'One Project' ? (
                            <>
                              <span className="font-bold">One</span> Project
                            </>
                          ) : (
                            <>
                              <span className="font-bold"> Unlimited</span> Project
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="tabler:circle-check"
                          className="text-xl text-primary shrink-0"
                        />
                        <p className="text-sm text-ld font-medium  whitespace-nowrap">
                          <span className="font-bold">One Year</span> Technical Support
                        </p>
                      </div>
                    </div>
                    <div className="mt-8">
                      {item.isPopular ? (
                        <Button size={'lg'} color={'primary'} className="py-0 font-medium  w-full">
                          Purchase Now
                        </Button>
                      ) : (
                        <Button
                          size={'lg'}
                          className="py-0 bg-dark hover:bg-primary text-white font-medium  w-full"
                        >
                          Purchase Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};



import { Breadcrumb, BreadcrumbItem } from "flowbite-react";
import CardBox from "src/components/shared/CardBox";
interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: JSX.Element;
}

const BreadcrumbComp = ({ items, title }: BreadCrumbType) => {
  return (
    <>
      <CardBox className={`mb-[30px]`}>
        <Breadcrumb className="flex justify-between">
          <h6 className="text-base">{title}</h6>
          <div className="flex items-center gap-3 ms-auto">
            {items
              ? items.map((item) => (
                  <div key={item.title}>
                    {item.to ? (
                      <BreadcrumbItem href={item.to}>
                       Home
                        <div className=" h-1 w-1 ms-3 rounded-full bg-dark/30 dark:bg-white/30"></div>
                      </BreadcrumbItem>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </div>
                ))
              : ""}
          </div>
        </Breadcrumb>
      </CardBox>
    </>
  );
};

export default BreadcrumbComp;

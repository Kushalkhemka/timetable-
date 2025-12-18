import {
  Dropdown,
  DropdownItem,
  RatingStar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Checkbox,
  Rating,
  TextInput,
  Badge,
  Pagination,
} from 'flowbite-react';
import CardBox from 'src/components/shared/CardBox';
import { Icon } from '@iconify/react';
import SimpleBar from 'simplebar-react';

import { HiOutlineDotsVertical } from 'react-icons/hi';
import user1 from '/src/assets/images/profile/user-2.jpg';
import user2 from '/src/assets/images/profile/user-3.jpg';
import user3 from '/src/assets/images/profile/user-4.jpg';
import user4 from '/src/assets/images/profile/user-5.jpg';
import user5 from '/src/assets/images/profile/user-6.jpg';

import product1 from '/src/assets/images/products/product-5.png';
import product2 from '/src/assets/images/products/product-6.png';
import product3 from '/src/assets/images/products/product-7.png';
import product4 from '/src/assets/images/products/product-8.png';
import product5 from '/src/assets/images/products/product-9.png';
import { useState } from 'react';

const LatestReview = () => {
  const [flowPagin, setFlowPagin] = useState(1);
  const onFlowChange = (page: number) => setFlowPagin(page);

  const [searchTerm, setSearchTerm] = useState('');

  /*Table Action*/
  const tableActionData = [
    {
      icon: 'solar:add-circle-outline',
      listtitle: 'Add',
    },
    {
      icon: 'solar:pen-new-square-broken',
      listtitle: 'Edit',
    },
    {
      icon: 'solar:trash-bin-minimalistic-outline',
      listtitle: 'Delete',
    },
  ];

  const LatestReviewData = [
    {
      img: product1,
      name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
      profile: user1,
      customername: 'Arlene McCoy',
      customeremail: 'macoy@arlene.com',
      review: 5,
      reviewtext:
        'This theme is great. Clean and easy to understand. Perfect for those who don t havetime to',
      time: 'Nov 8',
      statuscolor: 'error',
      statustext: 'Pending',
    },
    {
      img: product2,
      name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
      profile: user2,
      customername: 'Jerome Bell',
      customeremail: 'belljerome@yahoo.com',
      review: 4,
      reviewtext:
        'It is a Mac, after all. Once you have gone Mac,there s no going back. My first Maclastedover nine years',
      time: 'Nov 8',
      statuscolor: 'success',
      statustext: 'Confirmed',
    },
    {
      img: product3,
      name: 'PlayStation 5 DualSense Wireless Controller',
      profile: user3,
      customername: 'Jacob Jones',
      customeremail: 'jones009@hotmail.com',
      review: 4,
      reviewtext:
        ' The best experience we could hope for.Customer service team is amazing and thequality of their products',
      time: 'Nov 8',
      statuscolor: 'error',
      statustext: 'Pending',
    },
    {
      img: product4,
      name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
      profile: user5,
      customername: 'Messey Jones',
      customeremail: 'jones009@hotmail.com',
      review: 4,
      reviewtext:
        ' The best experience we could hope for.Customer service team is amazing and thequality of their products',
      time: 'Nov 8',
      statuscolor: 'success',
      statustext: 'Confirmed',
    },
    {
      img: product5,
      name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart Tv',
      profile: user4,
      customername: 'Annette Black',
      customeremail: 'blackanne@yahoo.com',
      review: 3,
      reviewtext:
        ' The controller is quite comfy for me. Despiteits increased size, the controller still fits well',
      time: 'Nov 8',
      statuscolor: 'success',
      statustext: 'Confirmed',
    },
  ];

  const filteredReviews = LatestReviewData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <CardBox>
        <div className="flex md:flex-row flex-col gap-4 justify-between align-baseline">
          <div>
            <h5 className="card-title">Latest Reviews</h5>
            <p className="card-subtitle">Review received across all channels</p>
          </div>
          <div className="text-end flex gap-3 items-center">
            <TextInput
              placeholder="Search"
              className="form-control-rounded w-full"
              sizing="md"
              required
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={() => (
                <Icon icon="solar:magnifer-line-duotone" className="text-ld" height={22} />
              )}
            />
            <div>
              <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                  <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer border border-ld">
                    <HiOutlineDotsVertical size={22} />
                  </span>
                )}
              >
                {tableActionData.map((items, index) => (
                  <DropdownItem key={index} className="flex gap-3">
                    {' '}
                    <Icon icon={`${items.icon}`} height={18} />
                    <span>{items.listtitle}</span>
                  </DropdownItem>
                ))}
              </Dropdown>
            </div>
          </div>
        </div>
        <SimpleBar className="max-h-[1000px]">
          <div className="overflow-x-auto overflow-y-hidden ">
            <Table hoverable className="mt-6 ">
              <TableHead>
                <TableHeadCell className=" text-base font-semibold py-3">
               #
                </TableHeadCell>
                <TableHeadCell className="text-base font-semibold  py-3">Products</TableHeadCell>
                <TableHeadCell className="text-base font-semibold  py-3">Customer</TableHeadCell>
                <TableHeadCell className="text-base font-semibold py-3">Reviews</TableHeadCell>
                <TableHeadCell className="text-base font-semibold py-3">Status</TableHeadCell>
                <TableHeadCell className="text-base font-semibold py-3">Date</TableHeadCell>
                <TableHeadCell></TableHeadCell>
              </TableHead>
              <TableBody className="divide-y divide-border dark:divide-darkborder ">
                {filteredReviews.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="whitespace-nowrap ">
                      <Checkbox className="checkbox" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap py-6">
                      <div className="flex gap-3 items-center">
                        <img src={item.img} alt="icon" className="h-[60px] w-[60px] rounded-md" />
                        <div className="truncat line-clamp-2 sm:text-wrap max-w-56">
                          <h6 className="text-base">{item.name}</h6>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap ">
                      <div className="flex gap-3 items-center">
                        <img src={item.profile} alt="icon" className="h-10 w-10 rounded-full" />
                        <div className="truncat line-clamp-2 text-wrap max-w-56">
                          <h6 className="text-base">{item.customername}</h6>
                          <p className="text-sm text-ld">{item.customeremail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {item.review == 5 ? (
                        <Rating size={'sm'} className="mt-1">
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                        </Rating>
                      ) : item.review == 4 ? (
                        <Rating size={'sm'} className="mt-1">
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                          <RatingStar filled={false} />
                        </Rating>
                      ) : (
                        <Rating size={'sm'} className="mt-1">
                          <RatingStar />
                          <RatingStar />
                          <RatingStar />
                          <RatingStar filled={false} />
                          <RatingStar filled={false} />
                        </Rating>
                      )}
                      <p className="text-ld truncat line-clamp-2 text-wrap max-w-56 text-sm">
                        {item.reviewtext}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        color={`light${item.statuscolor}`}
                        className={`border font-medium border-${item.statuscolor} `}
                      >
                        {item.statustext}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <p className="text-ld text-sm">{item.time}</p>
                    </TableCell>

                    <TableCell>
                      <Dropdown
                        label=""
                        dismissOnClick={false}
                        renderTrigger={() => (
                          <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-lightprimary hover:text-primary cursor-pointer">
                            <HiOutlineDotsVertical size={22} />
                          </span>
                        )}
                      >
                        {tableActionData.map((items, index) => (
                          <DropdownItem key={index} className="flex gap-3">
                            <Icon icon={`${items.icon}`} height={18} />
                            <span>{items.listtitle}</span>
                          </DropdownItem>
                        ))}
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SimpleBar>

        <div className="flex justify-between items-center py-3">
          <p>1-6 of 32</p>
          <Pagination
            layout="navigation"
            currentPage={flowPagin}
            totalPages={100}
            onPageChange={onFlowChange}
          />
        </div>
      </CardBox>
    </>
  );
};

export default LatestReview;

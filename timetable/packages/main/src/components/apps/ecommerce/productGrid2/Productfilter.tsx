import { Icon } from '@iconify/react';
import { ProductContext } from 'src/context/Ecommercecontext';
import { ProductFiterType } from 'src/types/apps/eCommerce';
import { Button, Dropdown, DropdownItem} from 'flowbite-react';
import { useContext } from 'react';
import { MdCheck } from 'react-icons/md';
import CardBox from 'src/components/shared/CardBox';
import SimpleBar from 'simplebar-react';
import { IconChevronDown, IconCircleCheck } from '@tabler/icons-react';

const ProductFilter = () => {
  const {
    selectedCategory,
    selectCategory,
    sortBy,
    updateSortBy,
    selectedGender,
    selectGender,
    priceRange,
    updatePriceRange,
    selectedColor,
    selectColor,
    products,
    filterReset,
  } = useContext(ProductContext);

  const filterCategory: ProductFiterType[] = [
    {
      id: 2,
      name: 'All',
      sort: 'All',
      icon: 'solar:clipboard-list-linear',
    },
    {
      id: 3,
      name: 'Fashion',
      sort: 'fashion',
      icon: 'solar:medal-ribbon-star-linear',
    },
    {
      id: 9,
      name: 'Books',
      sort: 'books',
      icon: 'solar:book-2-outline',
    },
    {
      id: 10,
      name: 'Toys',
      sort: 'toys',
      icon: 'solar:smile-circle-outline',
    },
    {
      id: 11,
      name: 'Electronics',
      sort: 'electronics',
      icon: 'solar:laptop-broken',
    },
  ];
  const filterbySort = [
    {
      id: 1,
      value: 'newest',
      label: 'Newest',
      icon: 'solar:presentation-graph-outline',
    },
    {
      id: 2,
      value: 'priceDesc',
      label: 'Price: High-Low',
      icon: 'solar:graph-down-outline',
    },
    {
      id: 3,
      value: 'priceAsc',
      label: 'Price: Low-High',
      icon: 'solar:graph-up-outline',
    },
    {
      id: 4,
      value: 'discount',
      label: 'Discounted',
      icon: 'solar:star-fall-minimalistic-2-broken',
    },
  ];
  const Gender = [
    {
      id: 1,
      radioid: 'All',
    },
    {
      id: 2,
      radioid: 'Men',
    },
    {
      id: 3,
      radioid: 'Women',
    },
    {
      id: 4,
      radioid: 'Kids',
    },
  ];
  const filterbyPrice = [
    {
      id: 1,
      lable: 'All',
      radioid: 'all',
    },
    {
      id: 2,
      lable: '0-50',
      radioid: '0-50',
    },
    {
      id: 3,
      lable: '50-100',
      radioid: '50-100',
    },
    {
      id: 4,
      lable: '100-200',
      radioid: '100-200',
    },
    {
      id: 5,
      lable: '200-99999',
      radioid: '200-99999',
    },
  ];

  const getUniqueColors = () => {
    const allColors = products.flatMap((product) => product.colors);
    return ['All', ...Array.from(new Set(allColors))];
  };

  const filterbyColors = getUniqueColors();

  return (
    <>
      <CardBox className="mb-6 py-2 lg:block hidden">
        <div className="flex  items-center ">
          Filter By:
          <div className="relative group/menu border-e border-ld px-6">
            <Dropdown
              label=""
              className="w-screen sm:w-52  rounded-sm "
              dismissOnClick={false}
              renderTrigger={() => (
                <h6 className="flex gap-2 items-center leading-normal cursor-pointer">
                  Category <IconChevronDown size={16} />
                </h6>
              )}
            >
              <SimpleBar className="max-h-80  p-3">
                {filterCategory.map((filter) => {
                  return (
                    <DropdownItem
                      key={`category-item-${filter.id}`}
                      className={` flex gap-2  rounded-md text-ld cursor-pointer  ${
                        selectedCategory === filter.sort
                          ? 'text-primary bg-lightprimary hover:bg-lightprimary! dark:hover:bg-lightprimary!'
                          : 'hover:bg-muted dark:hover:bg-lightprimary/60'
                      }`}
                      onClick={() => selectCategory(filter.sort as string)}
                    >
                      <Icon icon={filter.icon} height={18} />
                      {filter.name}
                    </DropdownItem>
                  );
                })}
              </SimpleBar>
            </Dropdown>
          </div>
          <div className="relative group/menu border-e border-ld px-6">
            <Dropdown
              label=""
              className="w-screen sm:w-52  rounded-sm"
              dismissOnClick={false}
              renderTrigger={() => (
                <h6 className="flex gap-2 items-center leading-normal cursor-pointer">
                  Sort By <IconChevronDown size={16} />
                </h6>
              )}
            >
              <SimpleBar className="max-h-80 p-3">
                {filterbySort.map((filter) => {
                  return (
                    <DropdownItem
                      key={`sort-item-${filter.id}`}
                      className={`flex gap-2 px-4 rounded-md text-ld cursor-pointer ${
                        sortBy === filter.value
                          ? 'text-primary bg-lightprimary hover:bg-lightprimary dark:hover:bg-lightprimary'
                          : 'hover:bg-muted dark:hover:bg-darkmuted'
                      }`}
                      onClick={() => updateSortBy(filter.value)}
                    >
                      <Icon icon={filter.icon} height={18} />
                      {filter.label}
                    </DropdownItem>
                  );
                })}
              </SimpleBar>
            </Dropdown>
          </div>
          <div className="relative group/menu border-e border-ld px-6">
            <Dropdown
              label=""
              className="w-screen sm:w-52  rounded-sm"
              dismissOnClick={false}
              renderTrigger={() => (
                <h6 className="flex gap-2 items-center leading-normal cursor-pointer">
                  Gender <IconChevronDown size={16} />
                </h6>
              )}
            >
              <SimpleBar className="max-h-80 p-3">
                {Gender.map((gen) => {
                  return (
                    <DropdownItem
                      key={`gender-${gen.id}`}
                      className={`flex gap-2 px-4 rounded-md text-ld cursor-pointer ${
                        selectedGender === gen.radioid
                          ? 'text-primary bg-lightprimary hover:bg-lightprimary dark:hover:bg-lightprimary'
                          : 'hover:bg-muted dark:hover:bg-darkmuted'
                      }`}
                      onClick={() => selectGender(gen.radioid)}
                    >
                      <IconCircleCheck size={18} />
                      {gen.radioid}
                    </DropdownItem>
                  );
                })}
              </SimpleBar>
            </Dropdown>
          </div>
          <div className="relative group/menu border-e border-ld px-6">
            <Dropdown
              label=""
              className="w-screen sm:w-52  rounded-sm"
              dismissOnClick={false}
              renderTrigger={() => (
                <h6 className="flex gap-2 items-center leading-normal cursor-pointer">
                  Pricing <IconChevronDown size={16} />
                </h6>
              )}
            >
              <SimpleBar className="max-h-80 p-3">
                {filterbyPrice.map((price) => {
                  return (
                   
                    <DropdownItem
                      key={`price-${price.id}`}
                      className={`flex gap-2 px-4 rounded-md text-ld cursor-pointer ${
                        priceRange === price.lable
                          ? 'text-primary bg-lightprimary hover:bg-lightprimary dark:hover:bg-lightprimary'
                          : 'hover:bg-muted dark:hover:bg-darkmuted'
                      }`}
                      onClick={() => updatePriceRange(price.lable)}
                    >
                      <IconCircleCheck size={18} />
                      {price.lable}
                    </DropdownItem>
                  );
                })}
              </SimpleBar>
            </Dropdown>
          </div>
          <div className="relative group/menu  px-4">
            <Dropdown
              label=""
              className="w-screen sm:w-52  rounded-sm"
              dismissOnClick={false}
              renderTrigger={() => (
                <h6 className="flex gap-2 items-center leading-normal cursor-pointer">
                  Colors <IconChevronDown size={16} />
                </h6>
              )}
            >
              <SimpleBar className="max-h-80 p-3">
                <div className="flex flex-row flex-wrap gap-2 mb-7">
                  {filterbyColors.map((color, index) => (
                    <label
                      key={`color-${index}`}
                      className="h-6 w-6 rounded-full  cursor-pointer flex items-center justify-center"
                      style={{
                        backgroundColor: color !== 'All' ? color : '#fff',
                        border: color === 'All' ? '1px solid #ccc' : 'none',
                      }}
                      onClick={() =>
                        selectedColor === color ? selectColor('All') : selectColor(color)
                      }
                    >
                      {selectedColor === color && <MdCheck size={16} className="text-gray-500" />}
                    </label>
                  ))}
                </div>
              </SimpleBar>
            </Dropdown>
          </div>
          <div className="ms-auto">
            <Button color={'primary'} className="w-full" onClick={filterReset}>
              Reset Filter
            </Button>
          </div>
        </div>
      </CardBox>
    </>
  );
};

export default ProductFilter;

import { Button, Select, TextInput } from 'flowbite-react';
import { useContext } from 'react';
import { Icon } from '@iconify/react';
import { ProductContext } from 'src/context/Ecommercecontext';
import React from 'react';

type Props = {
  onClickFilter: (event: React.MouseEvent<HTMLElement>) => void;
};
const ProductSearch = ({ onClickFilter }: Props) => {
  const { searchProducts } = useContext(ProductContext);
  const dropdownItems = ['Most Recent', 'April 2025', 'May 2025', 'June 2025'];
  return (
    <>
      <div className="flex justify-between items-center lg:gap-0 gap-3">
        <div className="flex gap-3 shrink-0">
          <h5 className="card-title lg:flex hidden">12 Products</h5>
          <Button
            color={'lightprimary'}
            className="btn-circle p-0 lg:hidden flex"
            onClick={onClickFilter}
          >
            <Icon icon="solar:hamburger-menu-linear" height={18} />
          </Button>
        </div>
        <div className='flex gap-3'>
          <TextInput
            id="search"
            placeholder="Search Products"
            className="form-control"
            sizing="sm"
            required
            onChange={(event) => searchProducts(event.target.value)}
            icon={() => <Icon icon="solar:magnifer-line-duotone" height={18} />}
          />
          <Select required className="form-control select-option-fill">
            {dropdownItems.map((items, index) => {
              return <option key={index}>{items}</option>;
            })}
          </Select>
        </div>
      </div>
    </>
  );
};

export default ProductSearch;

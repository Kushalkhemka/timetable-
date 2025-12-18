import { Dropdown, DropdownItem, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import * as SearchData from './Data';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { Link } from 'react-router';

const Search = () => {
  return (
    <div>
      <Dropdown
        label=""
        className="w-screen sm:w-[360px] py-4  rounded-sm "
        dismissOnClick={false}
        renderTrigger={() => (
          <TextInput
            placeholder="Try to searching ..."
            className="form-control-rounded w-full"
            sizing="md"
            required
            icon={() => <Icon icon="solar:magnifer-line-duotone" className="text-ld" height={22} />}
          />
        )}
      >
        <h5 className="card-title px-6 mb-3">Quick Page Links</h5>
        <SimpleBar>
          {SearchData.SearchLinks.map((links, index) => (
            <DropdownItem
              as={Link}
              to={links.href}
              className="flex justify-between items-center bg-hover group/link w-full px-4"
              key={index}
            >
              <Link to={links.href} className="py-1 px-3  group relative" key={index}>
                <h6 className="group-hover:text-primary mb-1 font-medium text-sm">{links.title}</h6>
                <p className="text-xs text-link dark:text-darklink opacity-90 font-medium">
                  {links.href}
                </p>
              </Link>
            </DropdownItem>
          ))}
        </SimpleBar>
      </Dropdown>
    </div>
  );
};

export default Search;

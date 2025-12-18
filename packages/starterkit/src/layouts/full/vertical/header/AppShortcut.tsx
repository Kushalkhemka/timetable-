import { Icon } from '@iconify/react';
import * as AppLink from './Data';
import 'simplebar-react/dist/simplebar.min.css';
import { Dropdown, DropdownItem } from 'flowbite-react';
import { Link } from 'react-router';

const AppShortcut = () => {
  return (
    <div className="relative group/menu">
      <Dropdown
        label=""
        className="w-screen sm:w-[400px] rounded-sm"
        dismissOnClick={false}
        renderTrigger={() => (
          <div className="h-10 w-10 hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary text-link dark:text-white">
            <Icon icon="solar:widget-add-line-duotone" height={20} />
          </div>
        )}
      >
        <div className="flex items-center  px-6 justify-between">
          <h3 className="text-lg font-semibold py-3 text-ld">Shortcuts</h3>
        </div>
        <div className="grid grid-cols-12 border-t border-ld">
          {AppLink.AppLink.map((links, index) => {
            const itemsPerRow = 2;
            const totalItems = AppLink.AppLink.length;
            const rowCount = Math.ceil(totalItems / itemsPerRow);
            const currentRow = Math.floor(index / itemsPerRow);
            const isLastInRow = (index + 1) % itemsPerRow === 0;
            const isInLastRow = currentRow === rowCount - 1;

            return (
              <div
                key={index}
                className={`col-span-6 border-ld
          ${isLastInRow ? '' : 'border-e'}
          ${isInLastRow ? '' : 'border-b'}`}
              >
                <DropdownItem
                  as={Link}
                  to={links.href}
                  className="px-6 py-3 bg-hover group/link w-full"
                >
                  <div className="flex flex-col gap-1 justify-center items-center mx-auto">
                    <div
                      className={`h-11 w-11 flex justify-center items-center rounded-full bg-light${links.color}`}
                    >
                      <Icon icon={links.icon} height={24} className={`text-${links.color}`} />
                    </div>
                    <h5 className="text-base">{links.title}</h5>
                    <p className="card-subtitle !text-darklink font-normal">{links.subtitle}</p>
                  </div>
                </DropdownItem>
              </div>
            );
          })}
        </div>
      </Dropdown>
    </div>
  );
};

export default AppShortcut;

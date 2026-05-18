"use client";
import { Menu, MenuButton, MenuItem, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { BiChevronDown } from "react-icons/bi";

// Sử dụng Generic T kế thừa từ string | number để đảm bảo an toàn cho 'key'
interface DropDownItem<T> {
  value: T;
  label: string;
}

interface DropDownProps<T> {
  label: string;
  items: DropDownItem<T>[];
  value?: T;
  onChange?: (value: T) => void;
  icon?: React.ReactNode;
}

// Khai báo Generic <T extends string | number>
const DropDown = <T extends string | number>({
  label,
  items,
  value,
  onChange,
  icon,
}: DropDownProps<T>) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton
          className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm 
                               hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 active:scale-95"
        >
          {icon && (
            <span className="text-slate-400 group-hover:text-blue-500">
              {icon}
            </span>
          )}
          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
            {items.find((item) => item.value === value)?.label || label}
          </span>
          <BiChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-transform ui-open:rotate-180" />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu>
          <div className="py-1 absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-slate-100 focus:outline-none">
            {items.map((item) => (
              <MenuItem key={item.value}>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => onChange?.(item.value)}
                    className={`${
                      active ? "bg-blue-50 text-blue-600" : "text-slate-700"
                    } block w-full text-left px-4 py-2 text-sm transition-colors`}
                  >
                    {item.label}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </Menu>
      </Transition>
    </Menu>
  );
};

export default DropDown;

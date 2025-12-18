
import { uniqueId } from 'lodash';

const Menuitems = [
 {
    id: uniqueId(),
    title: "Dashboard",
    bg: 'primary',
    icon: "solar:layers-line-duotone",
    href: "",
    column:1,
    children: [
      {
        id: uniqueId(),
        title: "Sample Page",
        icon: "solar:home-angle-outline",
        href: "/",
      },
     
    ],
  },


];
export default Menuitems;

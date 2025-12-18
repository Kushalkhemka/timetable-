export interface ChildItem {
  id?: number | string;
  name?: string;
  icon?: any;
  children?: ChildItem[];
  item?: any;
  url?: any;
  color?: string;
  bg?: string;
  disabled?: boolean;
  subtitle?: string;
  chipbg?: string;
  chip?: string;
  outlineColor?: string;
  outlineText?: string;
}

export interface MenuItem {
  heading?: string;
  name?: string;
  icon?: any;
  id?: number;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

import { uniqueId } from 'lodash';

const SidebarContent: MenuItem[] = [
  {
    heading: 'Home',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:screencast-2-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/',
      },

      {
        name: 'Dashboard 2',
        icon: 'solar:chart-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/dashboards/dashboard2',
      },
      {
        id: uniqueId(),
        name: 'Front Pages',
        icon: 'solar:smart-speaker-minimalistic-line-duotone',
        bg: 'indigo',
        url: '',
        children: [
          {
            name: 'Homepage',
            id: uniqueId(),
            url: '/frontend-pages/homepage',
          },
          {
            name: 'About Us',
            id: uniqueId(),
            url: '/frontend-pages/aboutus',
          },
          {
            name: 'Blog',
            id: uniqueId(),
            url: '/frontend-pages/blog',
          },
          {
            name: 'Blog Details',
            id: uniqueId(),
            url: '/frontend-pages/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
          },
          {
            name: 'Contact Us',
            id: uniqueId(),
            url: '/frontend-pages/contact',
          },
          {
            name: 'Portfolio',
            id: uniqueId(),
            url: '/frontend-pages/portfolio',
          },
          {
            name: 'Pricing',
            id: uniqueId(),
            url: '/frontend-pages/pricing',
          },
        ],
      },
    ],
  },
  {
    heading: 'Apps',
    children: [
      {
        id: uniqueId(),
        name: 'Contacts',
        icon: 'solar:phone-line-duotone',
        bg: 'success',
        url: '/apps/contacts',
      },
      {
        name: 'Blogs',
        id: uniqueId(),
        icon: 'solar:widget-add-line-duotone',
        bg: 'info',
        children: [
          {
            id: uniqueId(),
            name: 'Blog Post',
            url: '/apps/blog/post',
          },
          {
            id: uniqueId(),
            name: 'Blog Detail',
            url: '/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
          },
        ],
      },
      {
        name: 'Ecommerce',
        id: uniqueId(),
        icon: 'solar:cart-3-line-duotone',
        bg: 'warning',
        children: [
          {
            id: uniqueId(),
            name: 'Shop One',
            url: '/apps/ecommerce/shop',
          },
          {
            id: uniqueId(),
            name: 'Shop Two',
            url: '/apps/ecommerce/shop2',
          },
          {
            id: uniqueId(),
            name: 'Details One',
            url: '/apps/ecommerce/detail/3',
          },
          {
            id: uniqueId(),
            name: 'Details Two',
            url: '/apps/ecommerce/detail-two/3',
          },
          {
            id: uniqueId(),
            name: 'List',
            url: '/apps/ecommerce/list',
          },
          {
            id: uniqueId(),
            name: 'Checkout',
            url: '/apps/ecommerce/checkout',
          },
          {
            id: uniqueId(),
            name: 'Add Product',
            url: '/apps/ecommerce/addproduct',
          },
          {
            id: uniqueId(),
            name: 'Edit Product',
            url: '/apps/ecommerce/editproduct',
          },
        ],
      },
      {
        id: uniqueId(),
        name: 'Chats',
        icon: 'solar:chat-round-line-line-duotone',
        url: '/apps/chats',
        bg: 'primary',
      },
      {
        id: uniqueId(),
        name: 'Notes',
        icon: 'solar:document-text-outline',
        url: '/apps/notes',
        bg: 'error',
      },
      {
        id: uniqueId(),
        name: 'Calendar',
        icon: 'solar:calendar-mark-line-duotone',
        url: '/apps/calendar',
        bg: 'info',
      },
      {
        name: 'User Profile V1',
        id: uniqueId(),
        icon: 'solar:shield-user-outline',
        bg: 'error',
        children: [
          {
            id: uniqueId(),
            name: 'Profile',
            url: '/apps/user-profile/profile',
          },
          {
            id: uniqueId(),
            name: 'Followers',
            url: '/apps/user-profile/followers',
          },
          {
            id: uniqueId(),
            name: 'Friends',
            url: '/apps/user-profile/friends',
          },
          {
            id: uniqueId(),
            name: 'Gallery',
            url: '/apps/user-profile/gallery',
          },
        ],
      },
      {
        name: 'User Profile V2',
        id: uniqueId(),
        icon: 'solar:dropper-minimalistic-2-outline',
        bg: 'success',
        children: [
          {
            id: uniqueId(),
            name: 'Profile',
            url: '/apps/user-profile/profiletwo',
          },
          {
            id: uniqueId(),
            name: 'Teams',
            url: '/apps/user-profile/teams',
          },
          {
            id: uniqueId(),
            name: 'Projects',
            url: '/apps/user-profile/projects',
          },
          {
            id: uniqueId(),
            name: 'Connections',
            url: '/apps/user-profile/connections',
          },
        ],
      },
      {
        id: uniqueId(),
        name: 'Email',
        icon: 'solar:letter-linear',
        url: '/apps/email',
        bg: 'warning',
      },
      {
        id: uniqueId(),
        name: 'Tickets',
        icon: 'solar:ticker-star-outline',
        url: '/apps/tickets',
        bg: 'indigo',
      },
      {
        id: uniqueId(),
        name: 'Kanban',
        icon: 'solar:notebook-linear',
        url: '/apps/kanban',
        bg: 'error',
      },
      {
        id: uniqueId(),
        name: 'AI Modifications',
        icon: 'solar:magic-stick-3-line-duotone',
        url: '/apps/ai-modifications',
        bg: 'info',
      },
      {
        id: uniqueId(),
        name: 'Scenario Simulation',
        icon: 'solar:flask-linear',
        url: '/apps/scenario-simulation',
        bg: 'primary',
      },
      {
        name: 'Invoice',
        id: uniqueId(),
        icon: 'solar:bill-check-outline',
        bg: 'secondary',
        children: [
          {
            id: uniqueId(),
            name: 'List',
            url: '/apps/invoice/list',
          },
          {
            id: uniqueId(),
            name: 'Details',
            url: '/apps/invoice/detail/PineappleInc',
          },
          {
            id: uniqueId(),
            name: 'Create',
            url: '/apps/invoice/create',
          },
          {
            id: uniqueId(),
            name: 'Edit',
            url: '/apps/invoice/edit/PineappleInc',
          },
        ],
      },
    ],
  },

  {
    heading: 'Pages',
    children: [
      {
        name: 'Account Setting',
        icon: 'solar:settings-minimalistic-line-duotone',
        id: uniqueId(),
        url: '/theme-pages/account-settings',
        bg: 'info',
      },
      {
        name: 'FAQ',
        icon: 'solar:question-circle-line-duotone',
        id: uniqueId(),
        url: '/theme-pages/faq',
        bg: 'warning',
      },
      {
        name: 'Pricing',
        icon: 'solar:dollar-minimalistic-linear',
        id: uniqueId(),
        url: '/theme-pages/pricing',
        bg: 'error',
      },
      {
        name: 'Landingpage',
        icon: 'solar:bill-list-line-duotone',
        id: uniqueId(),
        url: '/landingpage',
        bg: 'success',
      },
      {
        name: 'Roll Base Access',
        icon: 'solar:accessibility-broken',
        id: uniqueId(),
        url: '/theme-pages/casl',
        bg: 'primary',
      },
      {
        name: 'Widget',
        id: uniqueId(),
        icon: 'solar:widget-4-line-duotone',
        bg: 'secondary',
        children: [
          {
            id: uniqueId(),
            name: 'Cards',
            url: '/widgets/cards',
          },
          {
            id: uniqueId(),
            name: 'Banners',
            url: '/widgets/banners',
          },
          {
            id: uniqueId(),
            name: 'Charts',
            url: '/widgets/charts',
          },
        ],
      },
    ],
  },

  {
    heading: 'FLOWBITE UI',
    children: [
      {
        name: 'Flowbite Ui',
        id: uniqueId(),
        icon: 'solar:cpu-bolt-line-duotone',
        bg: 'primary',
        children: [
          {
            id: uniqueId(),
            name: 'Accordion',
            url: '/ui-components/accordion',
          },
          {
            id: uniqueId(),
            name: 'Badge',
            url: '/ui-components/badge',
          },
          
          {
            id: uniqueId(),
            name: 'Dropdowns',
            url: '/ui-components/dropdown',
          },
          {
            id: uniqueId(),
            name: 'Modals',
            url: '/ui-components/modals',
          },
          {
            id: uniqueId(),
            name: 'Tab',
            url: '/ui-components/tab',
          },
          {
            id: uniqueId(),
            name: 'Tooltip',
            url: '/ui-components/tooltip',
          },
          {
            id: uniqueId(),
            name: 'Alert',
            url: '/ui-components/alert',
          },
         
          {
            id: uniqueId(),
            name: 'Breadcrumbs',
            url: '/ui-components/breadcrumb',
          },
          {
            id: uniqueId(),
            name: 'Drawer',
            url: '/ui-components/drawer',
          },
          {
            id: uniqueId(),
            name: 'Lists',
            url: '/ui-components/listgroup',
          },
          {
            id: uniqueId(),
            name: 'Carousel',
            url: '/ui-components/carousel',
          },
          {
            id: uniqueId(),
            name: 'Spinner',
            url: '/ui-components/spinner',
          },
          {
            id: uniqueId(),
            name: 'Avatar',
            url: '/ui-components/avatar',
          },
          {
            id: uniqueId(),
            name: 'Banner',
            url: '/ui-components/banner',
          },
         
          {
            id: uniqueId(),
            name: 'Card',
            url: '/ui-components/card',
          },
          
          {
            id: uniqueId(),
            name: 'Footer',
            url: '/ui-components/footer',
          },
          {
            id: uniqueId(),
            name: 'KBD',
            url: '/ui-components/kbd',
          },
          {
            id: uniqueId(),
            name: 'Mega Menu',
            url: '/ui-components/megamenu',
          },
          {
            id: uniqueId(),
            name: 'Navbar',
            url: '/ui-components/navbar',
          },
          {
            id: uniqueId(),
            name: 'Popover',
            url: '/ui-components/popover',
          },
          
          {
            id: uniqueId(),
            name: 'Sidebar',
            url: '/ui-components/sidebar',
          },
          {
            id: uniqueId(),
            name: 'Tables',
            url: '/ui-components/tables',
          },
          {
            id: uniqueId(),
            name: 'Timeline',
            url: '/ui-components/timeline',
          },
         
          {
            id: uniqueId(),
            name: 'Typography',
            url: '/ui-components/typography',
          },
        ],
      },

      {
        name: 'Flowbite Forms',
        id: uniqueId(),
        icon: 'solar:notes-line-duotone',
        bg: 'error',
        children: [
          
          {
            id: uniqueId(),
            name: 'Button',
            url: '/ui-components/buttons',
          },
           {
            id: uniqueId(),
            name: 'Button Group',
            url: '/ui-components/button-group',
          },
           {
            id: uniqueId(),
            name: 'Toast',
            url: '/ui-components/toast',
          },
          {
            id: uniqueId(),
            name: 'Rating',
            url: '/ui-components/rating',
          },
          {
            id: uniqueId(),
            name: 'Datepicker',
            url: '/ui-components/datepicker',
          },
          {
            id: uniqueId(),
            name: 'Progressbar',
            url: '/ui-components/progressbar',
          },
          {
            id: uniqueId(),
            name: 'Pagination',
            url: '/ui-components/pagination',
          },
        ],
      },
    ],
  },

  {
    heading: 'Headless Ui',
    children: [
      {
        name: 'Headless Ui',
        id: uniqueId(),
        bg: 'warning',
        icon: 'solar:text-underline-cross-broken',
        children: [
          {
            name: 'Dropdown',
            id: uniqueId(),
            url: '/headless-ui/dropdown',
          },
          {
            name: 'Disclosure',
            id: uniqueId(),
            url: '/headless-ui/disclosure',
          },
          {
            name: 'Dialog',
            id: uniqueId(),
            url: '/headless-ui/dialog',
          },
          {
            name: 'Popover',
            id: uniqueId(),
            url: '/headless-ui/popover',
          },
          {
            name: 'Tabs',
            id: uniqueId(),
            url: '/headless-ui/tabs',
          },
          {
            name: 'Transition',
            id: uniqueId(),
            url: '/headless-ui/transition',
          },
        ],
      },
      {
        name: 'Headless Form',
        id: uniqueId(),
        bg: 'info',
        icon: 'solar:align-vertical-spacing-line-duotone',
        children: [
          {
            id: uniqueId(),
            name: 'Buttons',
            url: '/headless-form/buttons',
          },
          {
            id: uniqueId(),
            name: 'Checkbox',
            url: '/headless-form/checkbox',
          },
          {
            id: uniqueId(),
            name: 'Combobox',
            url: '/headless-form/combobox',
          },
          {
            id: uniqueId(),
            name: 'Fieldset',
            url: '/headless-form/fieldset',
          },
          {
            id: uniqueId(),
            name: 'Input',
            url: '/headless-form/input',
          },
          {
            id: uniqueId(),
            name: 'Listbox',
            url: '/headless-form/listbox',
          },
          {
            id: uniqueId(),
            name: 'Radio Group',
            url: '/headless-form/radiogroup',
          },
          {
            id: uniqueId(),
            name: 'Select',
            url: '/headless-form/select',
          },
          {
            id: uniqueId(),
            name: 'Switch',
            url: '/headless-form/switch',
          },
          {
            id: uniqueId(),
            name: 'Textarea',
            url: '/headless-form/textarea',
          },
        ],
      },
    ],
  },

  {
    heading: 'Shadcn Ui',
    children: [
      {
        name: 'Shadcn Ui',
        id: uniqueId(),
        bg: 'error',
        icon: 'solar:adhesive-plaster-outline',
        children: [
          {
            id: uniqueId(),
            name: 'Badge',
            url: '/shadcn-ui/badge',
          },
          {
            id: uniqueId(),
            name: 'Button',
            url: '/shadcn-ui/buttons',
          },
          {
            id: uniqueId(),
            name: 'Dropdowns',
            url: '/shadcn-ui/dropdown',
          },
          {
            id: uniqueId(),
            name: 'Dialogs',
            url: '/shadcn-ui/dialogs',
          },
          {
            id: uniqueId(),
            name: 'Alert',
            url: '/shadcn-ui/alert',
          },
          {
            id: uniqueId(),
            name: 'Toast',
            url: '/shadcn-ui/toast',
          },
          {
            id: uniqueId(),
            name: 'Breadcrumbs',
            url: '/shadcn-ui/breadcrumb',
          },

          {
            id: uniqueId(),
            name: 'Carousel',
            url: '/shadcn-ui/carousel',
          },

          {
            id: uniqueId(),
            name: 'Card',
            url: '/shadcn-ui/card',
          },
          {
            id: uniqueId(),
            name: 'Datepicker',
            url: '/shadcn-ui/datepicker',
          },
          {
            id: uniqueId(),
            name: 'Combobox',
            url: '/shadcn-ui/combobox',
          },
          {
            id: uniqueId(),
            name: 'Collapsible',
            url: '/shadcn-ui/collapsible',
          },
          {
            id: uniqueId(),
            name: 'Command',
            url: '/shadcn-ui/command',
          },
          {
            id: uniqueId(),
            name: 'Skeleton',
            url: '/shadcn-ui/skeleton',
          },
          {
            id: uniqueId(),
            name: 'Avatar',
            url: '/shadcn-ui/avatar',
          },

          {
            id: uniqueId(),
            name: 'Tooltip',
            url: '/shadcn-ui/tooltip',
          },
          {
            name: 'Accordion',
            id: uniqueId(),
            url: '/shadcn-ui/accordion',
          },
          {
            id: uniqueId(),
            name: 'Tab',
            url: '/shadcn-ui/tab',
          },
          {
            id: uniqueId(),
            name: 'Progressbar',
            url: '/shadcn-ui/progressbar',
          },
          {
            id: uniqueId(),
            name: 'Drawer',
            url: '/shadcn-ui/drawer',
          },
        ],
      },
      {
        name: 'Shadcn Form',
        id: uniqueId(),
        bg: 'indigo',
        icon: 'solar:widget-6-line-duotone',
        children: [
          {
            id: uniqueId(),
            name: 'Input',
            url: '/shadcn-form/input',
          },
          {
            id: uniqueId(),
            name: 'Select',
            url: '/shadcn-form/select',
          },
          {
            id: uniqueId(),
            name: 'Checkbox',
            url: '/shadcn-form/checkbox',
          },
          {
            id: uniqueId(),
            name: 'Radio',
            url: '/shadcn-form/radio',
          },
        ],
      },
    ],
  },
  {
    heading: 'Tables',
    children: [
      {
        name: 'Basic Tables',
        icon: 'solar:tablet-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/tables/basic',
      },
      {
        name: 'Striped Rows Table',
        icon: 'solar:tablet-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/tables/striped-row',
      },
      {
        name: 'Hover Table',
        icon: 'solar:tablet-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/tables/hover-table',
      },
      {
        name: 'Checkbox Table',
        icon: 'solar:tablet-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/tables/checkbox-table',
      },
      {
        name: 'React Tables',
        id: uniqueId(),
        bg: 'error',
        icon: 'solar:round-transfer-vertical-broken',
        children: [
          {
            id: uniqueId(),
            name: 'Basic',
            url: '/react-tables/basic',
          },
          {
            id: uniqueId(),
            name: 'Dense',
            url: '/react-tables/dense',
          },
          {
            id: uniqueId(),
            name: 'Sorting',
            url: '/react-tables/sorting',
          },
          {
            id: uniqueId(),
            name: 'Filtering',
            url: '/react-tables/filtering',
          },
          {
            id: uniqueId(),
            name: 'Pagination',
            url: '/react-tables/pagination',
          },
          {
            id: uniqueId(),
            name: 'Row Selection',
            url: '/react-tables/row-selection',
          },
          {
            id: uniqueId(),
            name: 'Column Visibility',
            url: '/react-tables/column-visibility',
          },
          {
            id: uniqueId(),
            name: 'Editable',
            url: '/react-tables/editable',
          },
          {
            id: uniqueId(),
            name: 'Sticky',
            url: '/react-tables/sticky',
          },
          {
            id: uniqueId(),
            name: 'Drag & Drop',
            url: '/react-tables/drag-drop',
          },
          {
            id: uniqueId(),
            name: 'Empty',
            url: '/react-tables/empty',
          },
          {
            id: uniqueId(),
            name: 'Expanding',
            url: '/react-tables/expanding',
          },
        ],
      },
    ],
  },

  {
    heading: 'Shadcn Table',
    children: [
      {
        name: 'Basic Table',
        id: uniqueId(),
        bg: 'error',
        icon: 'solar:command-line-duotone',
        url: '/shadcn-tables/basic',
      },
    ],
  },

  {
    heading: 'Charts',
    children: [
      {
        name: 'Line Chart',
        icon: 'solar:chart-square-line-duotone',
        id: uniqueId(),
        bg: 'primary',
        url: '/charts/line',
      },
      {
        name: 'Area Chart',
        icon: 'solar:graph-new-broken',
        id: uniqueId(),
        bg: 'error',
        url: '/charts/area',
      },
      {
        name: 'Gradient Chart',
        icon: 'solar:round-graph-outline',
        id: uniqueId(),
        bg: 'warning',
        url: '/charts/gradient',
      },
      {
        name: 'Candlestick',
        icon: 'solar:chandelier-outline',
        id: uniqueId(),
        bg: 'indigo',
        url: '/charts/candlestick',
      },
      {
        name: 'Column',
        icon: 'solar:chart-2-bold-duotone',
        id: uniqueId(),
        bg: 'info',
        url: '/charts/column',
      },
      {
        name: 'Doughnut & Pie',
        icon: 'solar:pie-chart-2-linear',
        id: uniqueId(),
        bg: 'secondary',
        url: '/charts/doughnut',
      },
      {
        name: 'Radialbar & Radar',
        icon: 'solar:graph-line-duotone',
        id: uniqueId(),
        bg: 'success',
        url: '/charts/radialbar',
      },
    ],
  },

  {
    heading: 'Forms',
    children: [
      {
        id: uniqueId(),
        name: 'Forms Elements',
        icon: 'solar:text-selection-line-duotone',
        bg: 'error',
        url: '/forms/form-elements',
      },
      {
        id: uniqueId(),
        name: 'Forms Layouts',
        icon: 'solar:document-text-outline',
        bg: 'info',
        url: '/forms/form-layouts',
      },
      {
        id: uniqueId(),
        name: 'Forms Horizontal',
        icon: 'solar:slider-horizontal-line-duotone',
        bg: 'warning',
        url: '/forms/form-horizontal',
      },
      {
        id: uniqueId(),
        name: 'Forms Vertical',
        icon: 'solar:slider-vertical-line-duotone',
        bg: 'primary',
        url: '/forms/form-vertical',
      },
      {
        id: uniqueId(),
        name: 'Forms Custom',
        icon: 'solar:document-text-outline',
        bg: 'secondary',
        url: '/forms/form-custom',
      },
      {
        id: uniqueId(),
        name: 'Form Validation',
        icon: 'solar:bill-check-linear',
        bg: 'success',
        url: '/forms/form-validation',
      },
    ],
  },
  {
    heading: 'Icons',
    children: [
      {
        id: uniqueId(),
        name: 'Solar Icons',
        icon: 'solar:sticker-smile-circle-outline',
        bg: 'info',
        url: '/icons/solar',
      },
      {
        id: uniqueId(),
        name: 'Tabler Icons',
        icon: 'solar:sticker-smile-circle-outline',
        bg: 'warning',
        url: '/icons/tabler',
      },
    ],
  },

  {
    heading: 'Auth',
    children: [
      {
        name: 'Login',
        id: uniqueId(),
        bg: 'success',
        icon: 'solar:login-2-line-duotone',
        children: [
          {
            name: 'Side Login',
            id: uniqueId(),
            url: '/auth/auth1/login',
          },
          {
            name: 'Boxed Login',
            id: uniqueId(),
            url: '/auth/auth2/login',
          },
        ],
      },
      {
        name: 'Register',
        id: uniqueId(),
        bg: 'error',
        icon: 'solar:user-plus-broken',
        children: [
          {
            name: 'Side Register',
            id: uniqueId(),
            url: '/auth/auth1/register',
          },
          {
            name: 'Boxed Register',
            id: uniqueId(),
            url: '/auth/auth2/register',
          },
        ],
      },
      {
        name: 'Forgot Password',
        id: uniqueId(),
        bg: 'indigo',
        icon: 'solar:refresh-bold-duotone',
        children: [
          {
            name: 'Side Forgot Pwd',
            id: uniqueId(),
            url: '/auth/auth1/forgot-password',
          },
          {
            name: 'Boxed Forgot Pwd',
            id: uniqueId(),
            url: '/auth/auth2/forgot-password',
          },
        ],
      },

      {
        name: 'Two Steps',
        id: uniqueId(),
        bg: 'info',
        icon: 'solar:magnifer-zoom-in-linear',
        children: [
          {
            name: 'Side Two Steps',
            id: uniqueId(),
            url: '/auth/auth1/two-steps',
          },
          {
            name: 'Boxed Two Steps',
            id: uniqueId(),
            url: '/auth/auth2/two-steps',
          },
        ],
      },

      {
        name: 'Maintenance',
        icon: 'solar:settings-outline',
        id: uniqueId(),
        bg: 'secondary',
        url: '/auth/maintenance',
      },

      {
        name: 'Error',
        icon: 'solar:bug-minimalistic-line-duotone',
        id: uniqueId(),
        bg: 'error',
        url: '/auth/error',
      },
    ],
  },

  {
    heading: 'Other',
    children: [
      {
        name: 'Menu Level',
        bg: 'warning',
        id: uniqueId(),
        icon: 'solar:layers-minimalistic-line-duotone',
        children: [
          {
            name: 'Level 1',
            id: uniqueId(),
            url: '#',
          },
          {
            name: 'Level 2',
            id: uniqueId(),
            url: '#',
          },
          {
            id: uniqueId(),
            name: 'Level 1.1',
            icon: 'solar:double-alt-arrow-down-linear',
            url: '',
            children: [
              {
                id: uniqueId(),
                name: 'Level 2',
                url: '',
              },
              {
                id: uniqueId(),
                name: 'Level 2.1',
                icon: 'solar:double-alt-arrow-down-linear',
                url: '',
                children: [
                  {
                    id: uniqueId(),
                    name: 'Level 3',
                    url: '',
                  },
                  {
                    id: uniqueId(),
                    name: 'Level 3.1',
                    url: '',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: 'Disabled',
        icon: 'solar:forbidden-circle-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '#',
        disabled: true,
      },
      {
        name: 'Chip',
        icon: 'solar:shield-check-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '#',
        chipbg: 'error',
        chip: '9',
      },
      {
        name: 'Outlined',
        icon: 'solar:smile-circle-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '#',
        outlineColor: 'info',
        outlineText: 'outline',
      },
      {
        name: 'External Link',
        icon: 'solar:star-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: 'https://www.google.com/',
      },
    ],
  },
];

export default SidebarContent;

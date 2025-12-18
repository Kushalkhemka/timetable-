//Apps Links Type & Data
interface appsLinkType {
  href: string;
  title: string;
  subtext: string;
  avatar: string;
}
import chatImg from '/src/assets//images/svgs/icon-dd-chat.svg';
import cartImg from '/src/assets//images/svgs/icon-dd-cart.svg';
import invoiceImg from '/src/assets//images/svgs/icon-dd-invoice.svg';
import dateImg from '/src/assets//images/svgs/icon-dd-date.svg';
import mobileImg from '/src/assets//images/svgs/icon-dd-mobile.svg';
import lifebuoyImg from '/src/assets//images/svgs/icon-dd-lifebuoy.svg';
import messageBoxImg from '/src/assets//images/svgs/icon-dd-message-box.svg';
import applicationImg from '/src/assets//images/svgs/icon-dd-application.svg';

const appsLink: appsLinkType[] = [
  {
    href: '/apps/chats',
    title: 'Chat Application',
    subtext: 'New messages arrived',
    avatar: chatImg,
  },
  {
    href: '/apps/ecommerce/shop',
    title: 'eCommerce App',
    subtext: 'New stock available',
    avatar: cartImg,
  },
  {
    href: '/apps/notes',
    title: 'Notes App',
    subtext: 'To-do and Daily tasks',
    avatar: invoiceImg,
  },
  {
    href: '/apps/calendar',
    title: 'Calendar App',
    subtext: 'Get dates',
    avatar: dateImg,
  },
  {
    href: '/apps/contacts',
    title: 'Contact Application',
    subtext: '2 Unsaved Contacts',
    avatar: mobileImg,
  },
  {
    href: '/apps/tickets',
    title: 'Tickets App',
    subtext: 'Submit tickets',
    avatar: lifebuoyImg,
  },
  {
    href: '/apps/email',
    title: 'Email App',
    subtext: 'Get new emails',
    avatar: messageBoxImg,
  },
  {
    href: '/apps/blog/post',
    title: 'Blog App',
    subtext: 'added new blog',
    avatar: applicationImg,
  },
];

interface LinkType {
  href: string;
  title: string;
}

const pageLinks: LinkType[] = [
  {
    href: '/theme-pages/pricing',
    title: 'Pricing Page',
  },
  {
    href: '/auth/auth1/login',
    title: 'Authentication Design',
  },
  {
    href: '/auth/auth1/register',
    title: 'Register Now',
  },
  {
    href: '/404',
    title: '404 Error Page',
  },
  {
    href: '/apps/kanban',
    title: 'Kanban App',
  },
  {
    href: '/apps/user-profile/profile',
    title: 'User Application',
  },
  {
    href: '/apps/blog/post',
    title: 'Blog Design',
  },
  {
    href: '/apps/ecommerce/checkout',
    title: 'Shopping Cart',
  },
];

//   Search Data
interface SearchType {
  href: string;
  title: string;
}

const SearchLinks: SearchType[] = [
  {
    title: 'Dashboard 2',
    href: '/dashboards/dashboard2',
  },
  {
    title: 'eCommerce',
    href: '/apps/ecommerce/shop2',
  },
  {
    title: 'Chats',
    href: '/apps/chats',
  },
  {
    title: 'Contacts',
    href: '/apps/contacts',
  },
  {
    title: 'Posts',
    href: '/apps/blog/post',
  },
  {
    title: 'Notes',
    href: '/apps/notes',
  },
];

//   Message Data
interface AppLinkType {
  title: string;
  icon: any;
  subtitle: string;
  color: string;
  href: string;
}

const AppLink: AppLinkType[] = [
  {
    icon: 'solar:checklist-minimalistic-bold-duotone',
    color: 'info',
    title: 'Invoice',
    subtitle: 'Get latest invoice',
    href: '/apps/invoice/list',
  },
  {
    icon: 'solar:chat-square-call-bold-duotone',
    color: 'primary',
    title: 'Chat',
    subtitle: 'New Messages',
    href: '/apps/chats',
  },
  {
    icon: 'solar:phone-calling-rounded-bold-duotone',
    color: 'secondary',
    title: 'Contact',
    subtitle: '2 Unsaved Contacts',
    href: '/apps/contacts',
  },
  {
    icon: 'solar:mailbox-bold-duotone',
    color: 'error',
    title: 'Email',
    subtitle: 'Get new emails',
    href: '/apps/email',
  },
  {
    icon: 'solar:shield-user-bold-duotone',
    color: 'warning',
    title: 'Profile',
    subtitle: 'More information',
    href: '/apps/user-profile/profiletwo',
  },
  {
    icon: 'solar:calendar-mark-bold-duotone',
    color: 'success',
    title: 'Calendar',
    subtitle: 'Get dates',
    href: '/apps/calendar',
  },
];

//   Notification Data
interface NotificationType {
  title: string;
  icon: any;
  subtitle: string;
  bgcolor: string;
  color: string;
  time: string;
}

const Notification: NotificationType[] = [
  {
    icon: 'solar:widget-3-line-duotone',
    bgcolor: 'bg-lighterror dark:bg-lighterror',
    color: 'text-error',
    title: 'Launch Admin',
    subtitle: 'Just see the my new admin!',
    time: '9:30 AM',
  },
  {
    icon: 'solar:calendar-line-duotone',
    bgcolor: 'bg-lightprimary dark:bg-lightprimary',
    color: 'text-primary',
    title: 'Event Today',
    subtitle: 'Just a reminder that you have event',
    time: '9:15 AM',
  },
  {
    icon: 'solar:settings-line-duotone',
    bgcolor: 'bg-lightsecondary dark:bg-lightsecondary',
    color: 'text-secondary',
    title: 'Settings',
    subtitle: 'You can customize this template as you want',
    time: '4:36 PM',
  },
  {
    icon: 'solar:widget-4-line-duotone',
    bgcolor: 'bg-lightwarning dark:bg-lightwarning ',
    color: 'text-warning',
    title: 'Launch Admin',
    subtitle: 'Just see the my new admin!',
    time: '9:30 AM',
  },
  {
    icon: 'solar:calendar-line-duotone',
    bgcolor: 'bg-lightprimary dark:bg-lightprimary',
    color: 'text-primary',
    title: 'Event Today',
    subtitle: 'Just a reminder that you have event',
    time: '9:15 AM',
  },
  {
    icon: 'solar:settings-line-duotone',
    bgcolor: 'bg-lightsecondary dark:bg-lightsecondary',
    color: 'text-secondary',
    title: 'Settings',
    subtitle: 'You can customize this template as you want',
    time: '4:36 PM',
  },
];

//  Profile Data
interface ProfileType {
  title: string;
  icon: any;
  subtitle: string;
  color: string;
  bgcolor: string;
  url: string;
}

const profileDD: ProfileType[] = [
  {
    icon: 'solar:wallet-2-line-duotone',
    bgcolor: 'bg-lightprimary dark:bg-lightprimary',
    color: 'text-primary',
    title: 'My Profile',
    subtitle: 'Account settings',
    url: '/apps/user-profile/profiletwo',
  },
  {
    icon: 'solar:inbox-line-duotone',
    color: 'text-success',
    bgcolor: 'bg-lightsuccess dark:bg-lightsuccess',
    title: 'My Notes',
    subtitle: 'My Daily Notes',
    url: '/apps/notes',
  },
  {
    icon: 'solar:checklist-minimalistic-line-duotone',
    color: 'text-error',
    bgcolor: 'bg-lighterror dark:bg-lighterror',
    title: 'My Tasks',
    subtitle: 'To-do and Daily tasks ',
    url: '/apps/kanban',
  },
];

export { appsLink, pageLinks, SearchLinks, AppLink, Notification, profileDD };

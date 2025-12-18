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
    title: 'New Timetable',
    href: '/timetable/new',
  },
  {
    title: 'Draft Timetables',
    href: '/timetable/drafts',
  },
  {
    title: 'View Timetable',
    href: '/timetable/view',
  },
  {
    title: 'Ingest Curriculum',
    href: '/curriculum/ingest',
  },
  {
    title: 'User Management',
    href: '/user-management',
  },
  {
    title: 'AI Modifications',
    href: '/timetable/ai-modifications',
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
    icon: 'solar:calendar-add-bold-duotone',
    color: 'info',
    title: 'New Timetable',
    subtitle: 'Create a timetable',
    href: '/timetable/new',
  },
  {
    icon: 'solar:calendar-bold-duotone',
    color: 'primary',
    title: 'View Timetable',
    subtitle: 'Browse all timetables',
    href: '/timetable/view',
  },
  {
    icon: 'solar:shuffle-bold-duotone',
    color: 'secondary',
    title: 'Substitution',
    subtitle: 'Manage substitutions',
    href: '/substitution',
  },
  {
    icon: 'solar:checklist-minimalistic-bold-duotone',
    color: 'warning',
    title: 'Leave Management',
    subtitle: 'Requests & approvals',
    href: '/leave-management',
  },
  {
    icon: 'solar:clock-circle-bold-duotone',
    color: 'success',
    title: 'View Schedule',
    subtitle: 'Dynamic institute schedule',
    href: '/timetable/institute-schedule',
  },
  {
    icon: 'solar:book-2-bold-duotone',
    color: 'indigo',
    title: 'Ingest Curriculum',
    subtitle: 'Curriculum centered distribution',
    href: '/curriculum/ingest',
  },
  {
    icon: 'solar:magic-stick-3-bold-duotone',
    color: 'error',
    title: 'NLP Modifications',
    subtitle: 'Smart edits via AI',
    href: '/timetable/ai-modifications',
  },
  {
    icon: 'solar:shield-user-bold-duotone',
    color: 'primary',
    title: 'Faculty Management',
    subtitle: 'Add/Remove instructors',
    href: '/user-management',
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
    icon: 'solar:checklist-minimalistic-line-duotone',
    bgcolor: 'bg-lightwarning dark:bg-lightwarning',
    color: 'text-warning',
    title: 'Leave Requested',
    subtitle: 'A new leave request is awaiting review',
    time: 'Just now',
  },
  {
    icon: 'solar:shuffle-line-duotone',
    bgcolor: 'bg-lightsuccess dark:bg-lightsuccess',
    color: 'text-success',
    title: 'Teacher Substituted',
    subtitle: 'Substitution has been applied in today\'s schedule',
    time: '5 min ago',
  },
  {
    icon: 'solar:calendar-line-duotone',
    bgcolor: 'bg-lightprimary dark:bg-lightprimary',
    color: 'text-primary',
    title: 'Workshop Added',
    subtitle: 'New workshop updated in timetable',
    time: '1 hr ago',
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

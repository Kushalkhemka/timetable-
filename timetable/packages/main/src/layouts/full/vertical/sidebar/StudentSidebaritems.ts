import { uniqueId } from 'lodash';

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
  id?: number | string;
  to?: string;
  items?: MenuItem[];
  children?: ChildItem[];
  url?: any;
}

const StudentSidebarContent: MenuItem[] = [
  {
    heading: 'Student',
    children: [
      {
        name: 'Profile',
        icon: 'solar:user-circle-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/student/profile',
      },
      {
        name: 'My Timetable',
        icon: 'solar:calendar-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        children: [
          {
            name: 'Faculty TT',
            icon: 'solar:bookmark-square-line-duotone',
            id: uniqueId(),
            url: '/student/timetable/faculty',
          },
          {
            name: 'Class TT',
            icon: 'solar:book-2-line-duotone',
            id: uniqueId(),
            url: '/student/timetable/class',
          },
          {
            name: 'Room TT',
            icon: 'solar:building-3-line-duotone',
            id: uniqueId(),
            url: '/student/timetable/room',
          },
          {
            name: 'Lab TT',
            icon: 'solar:cpu-bolt-line-duotone',
            id: uniqueId(),
            url: '/student/timetable/lab',
          },
        ],
      },
      {
        name: 'Find Location',
        icon: 'solar:map-point-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/student/find-location',
      },
      {
        name: 'Leave Application',
        icon: 'solar:document-text-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/student/leave-application',
      },
      {
        name: 'Events Schedule',
        icon: 'solar:calendar-minimalistic-line-duotone',
        bg: 'warning',
        id: uniqueId(),
        url: '/student/events',
      },
      {
        name: 'Notifications',
        icon: 'solar:bell-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '/student/notifications',
        chip: '2',
        chipbg: 'error',
      },
      {
        name: 'To-DOs',
        icon: 'solar:checklist-minimalistic-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/student/todos',
      },
      {
        name: 'Study Material',
        icon: 'solar:folder-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/student/study-material',
      },
    ],
  },
];

export default StudentSidebarContent;





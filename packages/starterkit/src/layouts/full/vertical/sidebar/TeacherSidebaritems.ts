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

const TeacherSidebarContent: MenuItem[] = [
  {
    heading: 'Dashboard',
    children: [
      { name: 'Overview', icon: 'solar:screencast-2-line-duotone', bg: 'primary', id: uniqueId(), url: '/teacher' },
      { name: 'Analytics', icon: 'solar:chart-line-duotone', bg: 'secondary', id: uniqueId(), url: '/teacher/analytics' },
    ],
  },
  {
    heading: 'Teaching',
    children: [
      { name: 'My Classes', icon: 'solar:book-2-line-duotone', bg: 'info', id: uniqueId(), url: '/teacher/classes' },
      { name: 'Students', icon: 'solar:users-group-rounded-line-duotone', bg: 'success', id: uniqueId(), url: '/teacher/students' },
      { name: 'Assignments', icon: 'solar:document-text-line-duotone', bg: 'warning', id: uniqueId(), url: '/teacher/assignments' },
      { name: 'Grades', icon: 'solar:medal-star-line-duotone', bg: 'error', id: uniqueId(), url: '/teacher/grades' },
      { name: 'Attendance', icon: 'solar:checklist-minimalistic-line-duotone', bg: 'primary', id: uniqueId(), url: '/teacher/attendance' },
      { name: 'Schedule', icon: 'solar:calendar-line-duotone', bg: 'secondary', id: uniqueId(), url: '/teacher/schedule' },
    ],
  },
  {
    heading: 'Communication',
    children: [
      { name: 'Messages', icon: 'solar:chat-round-line-duotone', bg: 'primary', id: uniqueId(), url: '/teacher/messages' },
      { name: 'Announcements', icon: 'solar:megaphone-line-duotone', bg: 'secondary', id: uniqueId(), url: '/teacher/announcements' },
    ],
  },
  {
    heading: 'Administrative',
    children: [
      { name: 'Profile Settings', icon: 'solar:user-circle-line-duotone', bg: 'primary', id: uniqueId(), url: '/teacher/profile' },
      { name: 'Account Settings', icon: 'solar:settings-minimalistic-line-duotone', bg: 'secondary', id: uniqueId(), url: '/teacher/settings' },
      { name: 'Notifications', icon: 'solar:bell-line-duotone', bg: 'info', id: uniqueId(), url: '/teacher/notifications', chip: '5', chipbg: 'error' },
      { name: 'Help & Support', icon: 'solar:question-circle-line-duotone', bg: 'success', id: uniqueId(), url: '/teacher/help' },
    ],
  },
];

export default TeacherSidebarContent;



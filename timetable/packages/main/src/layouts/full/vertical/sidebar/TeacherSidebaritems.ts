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
      {
        name: 'Overview',
        icon: 'solar:screencast-2-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/teacher/dashboard',
      },
      {
        name: 'Analytics',
        icon: 'solar:chart-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/teacher/analytics',
      },
    ],
  },
  {
    heading: 'Teaching',
    children: [
      {
        name: 'My Classes',
        icon: 'solar:book-2-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/teacher/classes',
      },
      {
        name: 'Students',
        icon: 'solar:users-group-rounded-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/teacher/students',
      },
      {
        name: 'Assignments',
        icon: 'solar:document-text-line-duotone',
        bg: 'warning',
        id: uniqueId(),
        url: '/teacher/assignments',
      },
      {
        name: 'Grades',
        icon: 'solar:medal-star-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '/teacher/grades',
      },
      {
        name: 'Attendance',
        icon: 'solar:checklist-minimalistic-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/teacher/attendance',
      },
      {
        name: 'Schedule',
        icon: 'solar:calendar-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/teacher/schedule',
      },
    ],
  },
  {
    heading: 'Content Management',
    children: [
      {
        name: 'Lesson Plans',
        icon: 'solar:notebook-bookmark-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/teacher/lesson-plans',
      },
      {
        name: 'Resources',
        icon: 'solar:folder-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/teacher/resources',
      },
      {
        name: 'Quizzes & Tests',
        icon: 'solar:question-circle-line-duotone',
        bg: 'warning',
        id: uniqueId(),
        url: '/teacher/quizzes',
      },
      {
        name: 'Course Materials',
        icon: 'solar:file-text-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '/teacher/course-materials',
      },
    ],
  },
  {
    heading: 'Communication',
    children: [
      {
        name: 'Messages',
        icon: 'solar:chat-round-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/teacher/messages',
        chip: '3',
        chipbg: 'error',
      },
      {
        name: 'Announcements',
        icon: 'solar:megaphone-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/teacher/announcements',
      },
      {
        name: 'Parent Communication',
        icon: 'solar:users-group-two-rounded-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/teacher/parent-communication',
      },
      {
        name: 'Discussion Forums',
        icon: 'solar:chat-square-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/teacher/forums',
      },
    ],
  },
  {
    heading: 'Assessment & Reports',
    children: [
      {
        name: 'Gradebook',
        icon: 'solar:bookmark-square-line-duotone',
        bg: 'warning',
        id: uniqueId(),
        url: '/teacher/gradebook',
      },
      {
        name: 'Progress Reports',
        icon: 'solar:chart-2-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '/teacher/progress-reports',
      },
      {
        name: 'Performance Analytics',
        icon: 'solar:graph-up-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/teacher/performance-analytics',
      },
      {
        name: 'Export Data',
        icon: 'solar:export-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/teacher/export-data',
      },
    ],
  },
  {
    heading: 'Professional Development',
    children: [
      {
        name: 'Training Materials',
        icon: 'solar:video-library-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/teacher/training',
      },
      {
        name: 'Certifications',
        icon: 'solar:award-minimalistic-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/teacher/certifications',
      },
      {
        name: 'Peer Collaboration',
        icon: 'solar:users-group-two-rounded-line-duotone',
        bg: 'warning',
        id: uniqueId(),
        url: '/teacher/collaboration',
      },
      {
        name: 'Feedback & Reviews',
        icon: 'solar:star-line-duotone',
        bg: 'error',
        id: uniqueId(),
        url: '/teacher/feedback',
      },
    ],
  },
  {
    heading: 'Administrative',
    children: [
      {
        name: 'Profile Settings',
        icon: 'solar:user-circle-line-duotone',
        bg: 'primary',
        id: uniqueId(),
        url: '/teacher/profile',
      },
      {
        name: 'Account Settings',
        icon: 'solar:settings-minimalistic-line-duotone',
        bg: 'secondary',
        id: uniqueId(),
        url: '/teacher/settings',
      },
      {
        name: 'Notifications',
        icon: 'solar:bell-line-duotone',
        bg: 'info',
        id: uniqueId(),
        url: '/teacher/notifications',
        chip: '5',
        chipbg: 'error',
      },
      {
        name: 'Help & Support',
        icon: 'solar:question-circle-line-duotone',
        bg: 'success',
        id: uniqueId(),
        url: '/teacher/help',
      },
    ],
  },
];

export default TeacherSidebarContent;


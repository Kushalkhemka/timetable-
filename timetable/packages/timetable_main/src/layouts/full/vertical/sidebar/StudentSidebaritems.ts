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

const StudentSidebarContent: MenuItem[] = [
  {
    heading: 'Student Dashboard',
    children: [
      { name: 'Profile', icon: 'solar:user-circle-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/profile' },
      { 
        name: 'Timetables', 
        icon: 'solar:calendar-line-duotone', 
        bg: 'primary', 
        id: uniqueId(), 
        children: [
          { name: 'My Timetable', icon: 'solar:calendar-mark-bold-duotone', bg: 'primary', id: uniqueId(), url: '/student/timetable/my-timetable' },
          { name: 'Faculty Timetable', icon: 'solar:users-group-two-rounded-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/timetable/faculty-timetable' },
          { name: 'Room Timetable', icon: 'solar:home-2-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/timetable/room-timetable' },
          { name: 'Lab Timetable', icon: 'solar:microchip-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/timetable/lab-timetable' },
        ]
      },
      { name: 'Find Location', icon: 'solar:map-point-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/find-location' },
      { name: 'Leave Application', icon: 'solar:document-add-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/leave-application' },
      { name: 'Events Schedule', icon: 'solar:calendar-mark-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/events-schedule' },
      { name: 'Notifications', icon: 'solar:bell-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/notifications' },
      { name: 'To Do List', icon: 'solar:checklist-minimalistic-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/todo-list' },
      { name: 'Curriculum/Study Material', icon: 'solar:book-2-line-duotone', bg: 'primary', id: uniqueId(), url: '/student/curriculum' },
      { name: 'Internships', icon: 'mdi:briefcase-outline', bg: 'primary', id: uniqueId(), url: '/student/internships' },
    ],
  },
];

export default StudentSidebarContent;

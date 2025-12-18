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
    heading: 'Menu',
    children: [
      { name: 'New TimeTable', icon: 'solar:calendar-mark-bold-duotone', bg: 'primary', id: uniqueId(), url: '/timetable/new' },
      { name: 'Draft Timetables', icon: 'solar:clock-circle-line-duotone', bg: 'warning', id: uniqueId(), url: '/timetable/my-timetables' },
      { name: 'View TimeTable', icon: 'solar:calendar-line-duotone', bg: 'primary', id: uniqueId(), url: '/timetable/view' },
      { name: 'Substitution', icon: 'solar:widget-4-line-duotone', bg: 'primary', id: uniqueId(), url: '/substitution' },
      { name: 'Leave Management', icon: 'solar:checklist-minimalistic-line-duotone', bg: 'primary', id: uniqueId(), url: '/leave-management' },
      { name: 'View Dynamic Schedule', icon: 'solar:widget-3-line-duotone', bg: 'primary', id: uniqueId(), url: '/timetable/institute-schedule' },
      { name: 'Exam Scheduling', icon: 'solar:calendar-mark-line-duotone', bg: 'primary', id: uniqueId(), url: '/timetable/exams' },
      { name: 'Ingest Curriculum', icon: 'solar:document-add-line-duotone', bg: 'primary', id: uniqueId(), url: '/curriculum/ingest' },
      { name: 'AI Modifications', icon: 'solar:magic-stick-3-line-duotone', bg: 'primary', id: uniqueId(), url: '/timetable/ai-modifications' },
    ],
  },
  {
    heading: 'Administration',
    children: [
      { name: 'Admin Dashboard', icon: 'solar:chart-2-bold-duotone', bg: 'primary', id: uniqueId(), url: '/admin/dashboard' },
      { name: 'User Management', icon: 'solar:users-group-two-rounded-line-duotone', bg: 'primary', id: uniqueId(), url: '/user-management' },
      { name: 'API Docs', icon: 'solar:document-text-line-duotone', bg: 'primary', id: uniqueId(), url: '/docs/api' },
    ],
  },
];

export default SidebarContent;

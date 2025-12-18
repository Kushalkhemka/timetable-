// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import { useAuth } from 'src/context/AuthContext';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const StudentLayout = Loadable(lazy(() => import('../layouts/full/StudentLayout')));
const TeacherLayout = Loadable(lazy(() => import('../layouts/full/TeacherLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const GenerateTimetable = Loadable(lazy(() => import('../views/timetable/GenerateTimetable')));
const ViewTimetable = Loadable(lazy(() => import('../views/timetable/ViewTimetable')));
const ExamSchedule = Loadable(lazy(() => import('../views/timetable/ExamSchedule')));
const MyTimetables = Loadable(lazy(() => import('../views/timetable/MyTimetables')));
const InstituteSchedule = Loadable(lazy(() => import('../views/timetable/InstituteSchedule')));
const AIModifications = Loadable(lazy(() => import('../views/timetable/AIModifications')));
const IngestCurriculum = Loadable(lazy(() => import('../views/curriculum/IngestCurriculum')));
const UserManagement = Loadable(lazy(() => import('../views/user-management/UserManagement')));
const SubstitutionManagement = Loadable(lazy(() => import('../views/substitution/SubstitutionManagement')));
const LeaveManagement = Loadable(lazy(() => import('../views/leave/LeaveManagement')));
const APIDocs = Loadable(lazy(() => import('../views/docs/APIDocs')));
const AdminDashboard = Loadable(lazy(() => import('../views/admin/AdminDashboard')));

// Student Dashboard Components
const StudentDashboard = Loadable(lazy(() => import('../views/student/StudentDashboard')));
const TeacherDashboard = Loadable(lazy(() => import('../views/teacher/TeacherDashboard')));
const StudentProfile = Loadable(lazy(() => import('../views/student/profile/StudentProfile')));
const MyTimetable = Loadable(lazy(() => import('../views/student/timetable/MyTimetable')));
const FacultyTimetable = Loadable(lazy(() => import('../views/student/timetable/FacultyTimetable')));
const RoomTimetable = Loadable(lazy(() => import('../views/student/timetable/RoomTimetable')));
const LabTimetable = Loadable(lazy(() => import('../views/student/timetable/LabTimetable')));
const FindLocation = Loadable(lazy(() => import('../views/student/find-location/FindLocation')));
const LeaveApplication = Loadable(lazy(() => import('../views/student/leave-application/LeaveApplication')));
const EventsSchedule = Loadable(lazy(() => import('../views/student/events-schedule/EventsSchedule')));
const Notifications = Loadable(lazy(() => import('../views/student/notifications/Notifications')));
const TodoList = Loadable(lazy(() => import('../views/student/todo-list/TodoList')));
const Curriculum = Loadable(lazy(() => import('../views/student/curriculum/Curriculum')));
const Internships = Loadable(lazy(() => import('../views/student/internships/Internships')));

// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const TeacherLogin = Loadable(lazy(() => import('../views/authentication/auth1/TeacherLogin')));
const StudentLogin = Loadable(lazy(() => import('../views/authentication/auth1/StudentLogin')));
const TeacherRegister = Loadable(lazy(() => import('../views/authentication/auth1/TeacherRegister')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const TwoSteps2 = Loadable(lazy(() => import('../views/authentication/auth2/TwoSteps')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));

function PrivateRoute({ element }: { element: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <></>;
  return user ? element : <Navigate to="/auth/auth1/login" replace />;
}

function RoleRoute({ element, allow }: { element: JSX.Element; allow: Array<'teacher' | 'admin' | 'student'> }) {
  const { user, loading, role } = useAuth();
  if (loading) return <></>;
  if (!user) return <Navigate to="/auth/auth1/login" replace />;
  // Default to admin if no role is set (temporary fix)
  const userRole = role || 'admin';
  return allow.includes(userRole) ? element : <Navigate to="/" replace />;
}

function StudentOnlyRoute({ element }: { element: JSX.Element }) {
  const { user, loading, role } = useAuth();
  if (loading) return <></>;
  if (!user) return <Navigate to="/auth/auth1/login" replace />;
  if (role === 'teacher' || role === 'admin') return <Navigate to="/teacher" replace />;
  return element;
}

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', exact: true, element: <PrivateRoute element={<SamplePage />} /> },

      { path: '/sample-page', exact: true, element: <PrivateRoute element={<SamplePage />} /> },
      { path: '/timetable/view', exact: true, element: <PrivateRoute element={<ViewTimetable />} /> },
      { path: '/timetable/new', exact: true, element: <PrivateRoute element={<GenerateTimetable />} /> },
      { path: '/timetable/my-timetables', exact: true, element: <PrivateRoute element={<MyTimetables />} /> },
      { path: '/timetable/institute-schedule', exact: true, element: <PrivateRoute element={<InstituteSchedule />} /> },
      { path: '/timetable/ai-modifications', exact: true, element: <PrivateRoute element={<AIModifications />} /> },
      { path: '/timetable/exams', exact: true, element: <PrivateRoute element={<ExamSchedule />} /> },
      { path: '/leave-management', exact: true, element: <PrivateRoute element={<LeaveManagement />} /> },
      { path: '/curriculum/ingest', exact: true, element: <PrivateRoute element={<IngestCurriculum />} /> },
      { path: '/user-management', exact: true, element: <PrivateRoute element={<UserManagement />} /> },
      { path: '/substitution', exact: true, element: <PrivateRoute element={<SubstitutionManagement />} /> },
      { path: '/docs/api', exact: true, element: <PrivateRoute element={<APIDocs />} /> },
      { path: '/admin/dashboard', exact: true, element: <PrivateRoute element={<AdminDashboard />} /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      { path: '/student', exact: true, element: <StudentOnlyRoute element={<StudentDashboard />} /> },
      { path: '/student/profile', exact: true, element: <StudentOnlyRoute element={<StudentProfile />} /> },
      { path: '/student/timetable/my-timetable', exact: true, element: <StudentOnlyRoute element={<MyTimetable />} /> },
      { path: '/student/timetable/faculty-timetable', exact: true, element: <StudentOnlyRoute element={<FacultyTimetable />} /> },
      { path: '/student/timetable/room-timetable', exact: true, element: <StudentOnlyRoute element={<RoomTimetable />} /> },
      { path: '/student/timetable/lab-timetable', exact: true, element: <StudentOnlyRoute element={<LabTimetable />} /> },
      { path: '/student/find-location', exact: true, element: <StudentOnlyRoute element={<FindLocation />} /> },
      { path: '/student/leave-application', exact: true, element: <StudentOnlyRoute element={<LeaveApplication />} /> },
      { path: '/student/events-schedule', exact: true, element: <StudentOnlyRoute element={<EventsSchedule />} /> },
      { path: '/student/notifications', exact: true, element: <StudentOnlyRoute element={<Notifications />} /> },
      { path: '/student/todo-list', exact: true, element: <StudentOnlyRoute element={<TodoList />} /> },
      { path: '/student/curriculum', exact: true, element: <StudentOnlyRoute element={<Curriculum />} /> },
      { path: '/student/internships', exact: true, element: <StudentOnlyRoute element={<Internships />} /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/teacher',
    element: <TeacherLayout />,
    children: [
      { path: '/teacher', exact: true, element: <RoleRoute allow={['teacher','admin']} element={<TeacherDashboard />} /> },
      { path: '/teacher/dashboard', exact: true, element: <RoleRoute allow={['teacher','admin']} element={<TeacherDashboard />} /> },
      { path: '/teacher/*', element: <RoleRoute allow={['teacher','admin']} element={<TeacherDashboard />} /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/auth1/login', element: <Login /> },
      { path: '/auth/auth1/teacher-login', element: <TeacherLogin /> },
      { path: '/auth/auth1/teacher-register', element: <TeacherRegister /> },
      { path: '/auth/auth1/student-login', element: <StudentLogin /> },
      { path: '/auth/auth2/login', element: <Login2 /> },
      { path: '/auth/auth1/register', element: <Register /> },
      { path: '/auth/auth2/register', element: <Register2 /> },
      { path: '/auth/auth1/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/auth2/forgot-password', element: <ForgotPassword2 /> },
      { path: '/auth/auth1/two-steps', element: <TwoSteps /> },
      { path: '/auth/auth2/two-steps', element: <TwoSteps2 /> },
      { path: '/auth/maintenance', element: <Maintainance /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;

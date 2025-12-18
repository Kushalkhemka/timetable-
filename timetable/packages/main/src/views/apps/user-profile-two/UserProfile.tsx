import UserProfileApp from "src/components/apps/userprofile-two/profile";
import BreadcrumbComp from "src/layouts/full/shared/breadcrumb/BreadcrumbComp";



const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "User Profile Two",
  },
];
const UserProfile = () => {
  return (
    <>
      <BreadcrumbComp title="User Profile Two" items={BCrumb} />
      <UserProfileApp />
    </>
  );
};

export default UserProfile;

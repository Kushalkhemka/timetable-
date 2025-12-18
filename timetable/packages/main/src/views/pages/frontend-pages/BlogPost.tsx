import BlogDetailData from "src/components/apps/blog/detail";
import PurchaseTemp from "src/components/front-pages/homepage/PurchaseTemp";
import { BlogProvider } from "src/context/BlogContext";
import FrontEndBreadcrumb from "src/layouts/full/shared/breadcrumb/FrontBreadcrumb";


const BlogPost = () => {
  return (
    <>
      <FrontEndBreadcrumb title="Our most recent articles" link="Blog Details" />
      <div className="py-10">
        <div className="container mx-auto">
          <BlogProvider>
            <BlogDetailData />
          </BlogProvider>
        </div>
      </div>
      <PurchaseTemp />
    </>
  );
};

export default BlogPost;

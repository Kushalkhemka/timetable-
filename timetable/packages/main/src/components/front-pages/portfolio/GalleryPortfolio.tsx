
import { UserDataProvider } from "src/context/UserDataContext";
import PortfolioCards from "./PortfolioCards";

const GalleryPortfolio = () => {
  return (
    <>
      <UserDataProvider>
        <div className="container mx-auto py-12">
          <div className="grid grid-cols-12 gap-6">
            {/* GalleryCards */}
            <div className="col-span-12">
              <PortfolioCards />
            </div>
          </div>
        </div>
      </UserDataProvider>
    </>
  );
};

export default GalleryPortfolio;

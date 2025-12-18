
import * as listFeatureData from "../Data";
import CardBox from "../../shared/CardBox";

const AllFeatures = () => {
  return (
    <>
      <div className="md:py-20 py-12 relative bg-muted dark:bg-darkmuted/50">
        <div className="container">
          <div className="lg:w-3/5 w-full mx-auto text-center">
            <p
              className="text-lg text-ld mb-2"
              data-aos="fade-left"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              Almost covered everything
            </p>
            <h2
              className="text-center sm:text-4xl text-2xl  font-bold leading-[normal]"
              data-aos="fade-right"
              data-aos-delay="200"
              data-aos-duration="1000"
            >
              Other Amazing Features & Flexibility Provided
            </h2>
          </div>
          <div className="grid grid-cols-12 gap-6 mt-20">
            {listFeatureData.listFeature.map((item, index) => (
              <div
                className="xl:col-span-3 lg:col-span-4 md:col-span-6 col-span-12"
                key={index}
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <CardBox
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="1000"
                >
                  
                    <span
                      className={`h-12 w-12 rounded-lg flex items-center justify-center  bg-light${item.bgcolor} dark:bg-dark${item.bgcolor} text-${item.bgcolor}`}
                    >
                      {<item.featureicon size={26} />}
                    </span>
                    <h5 className="font-semibold card-title mt-4 ">
                      {item.title}
                    </h5>
                    <p className="text-sm text-ld">
                      {item.subtitle}
                    </p>
                  
                </CardBox>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllFeatures;

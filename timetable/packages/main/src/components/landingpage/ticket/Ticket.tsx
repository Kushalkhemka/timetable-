
import CardBox from "../../shared/CardBox";
import banner from "/src/assets/images/backgrounds/school.png";
import { Button } from "flowbite-react";
import { Link } from "react-router";


const Ticket = () => {
  return (
    <>
      <div className="bg-white dark:bg-dark">
        <div className="container">
          <CardBox className="bg-dark dark:bg-lightprimary relative lg:py-12 py-0 md:px-11">
            <div className="lg:w-2/4 w-full lg:pt-0 pt-12">
              <h2 className="text-4xl text-white text-center lg:text-start font-bold mb-5 leading-[54px]">
                Haven't found an answer to your question?
              </h2>
              <p className="text-white opacity-50 text-lg text-center lg:text-start pb-5 ">
                Connect with us either on discord or email us
              </p>
              <div className="flex sm:flex-row flex-col items-center justify-center lg:justify-start gap-3 mb-4 ">
                <Button
                  color={"primary"}
                  as={Link}
                  target="_blank" className="sm:w-fit w-full"
                   to ="https://discord.com/invite/eMzE8F6Wqs"
                  
                >
                  Ask on Discord
                </Button>
                <Button
                  color={"outlinewhite"}
                  as={Link}
                  target="_blank" className="sm:w-fit w-full"
                   to ="https://support.wrappixel.com/"
                  
                >
                  Submit Ticket
                </Button>
              </div>
            </div>
            <div className="lg:absolute relative md:end-0 lg:-end-6 md:bottom-0 mx-auto">
              <img src={banner} alt="banner" className="w-full mx-auto " />
            </div>
          </CardBox>
        </div>
      </div>
    </>
  );
};

export default Ticket;

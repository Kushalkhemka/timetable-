import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';

const Toaster = () => {
  useEffect(() => {
    toast(
      <div>
        <div className="flex gap-2 align-baseline">
          <IconAlertCircle size={20} />
          <div>
            <h5 className=" text-white text-base">Welcome to Spike!</h5>
            <p className="text-sm text-white/90">Easy to customize the Template!!!</p>
          </div>
        </div>
      </div>,
      {
        className: '!bg-primary !text-white !rounded-lg !overflow-hidden !py-4 !px-5 !font-sans',
      },
    );
  }, []);
  return (
    <div>
      {/*welcome Toastify */}
      <ToastContainer autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover progressClassName="!bg-gradient-to-r from-primary to-info" />
    </div>
  );
};

export default Toaster;

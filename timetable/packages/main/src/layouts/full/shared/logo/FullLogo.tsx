import { useContext } from 'react';
import DarkLogo from '/src/assets/images/logos/dark-logo.svg';
import LightLogo from '/src/assets/images/logos/light-logo.svg';
import DarkLogoRtl from '/src/assets/images/logos/logo-dark-rtl.svg';
import LightLogoRtl from '/src/assets/images/logos/logo-light-rtl.svg';
import { Link } from 'react-router';
import { CustomizerContext } from 'src/context/CustomizerContext';
const FullLogo = () => {
  const { activeMode, activeDir } = useContext(CustomizerContext);
  return (
    <Link to={'/'}>
      {activeMode === 'light' && activeDir === 'ltr' ? (
        <img src={DarkLogo} alt="logo" className="block" />
      ) : activeMode === 'light' && activeDir === 'rtl' ? (
        <img src={DarkLogoRtl} alt="logo" className="block" />
      ) : activeMode === 'dark' && activeDir === 'ltr' ? (
        <img src={LightLogo} alt="logo" className="block " />
      ) : activeMode === 'dark' && activeDir === 'rtl' ? (
        <img src={LightLogoRtl} alt="logo" className="block" />
      ) : null}
    </Link>
  );
};

export default FullLogo;

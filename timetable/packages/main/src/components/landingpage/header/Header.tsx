import { useState, useEffect } from 'react';
import 'flowbite';
import { Button, Navbar, NavbarCollapse, NavbarLink } from 'flowbite-react';
import PagesMenu from './Pagesmenu';
import DemosMenu from './DemosMenu';
import MobileDrawer from './MobileDrawer';
import FrontPageMenu from './FrontPageMenu';
import FullLogo from 'src/layouts/full/shared/logo/FullLogo';
import { Link } from 'react-router';

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`top-0 z-50 lp-header ${
          isSticky
            ? 'bg-white dark:bg-dark shadow-md fixed w-full'
            : 'bg-muted dark:bg-darkmuted/50'
        }`}
      >
        <Navbar className="fluid py-6 px-0! bg-transparent dark:bg-transparent flex navbar">
          <FullLogo />
          <MobileDrawer />
          <NavbarCollapse className="xl:block  md:hidden hidden">
            <DemosMenu />
            <FrontPageMenu />
            <PagesMenu />
            <NavbarLink
              className="!py-1.5 !px-4"
              target="_blank"
              href="https://wrappixel.github.io/premium-documentation-wp/react/spike/index.html"
            >
              Documentation
            </NavbarLink>
            <NavbarLink
              className="!py-1.5 !px-4"
              target="_blank"
              href="https://support.wrappixel.com/"
            >
              Support
            </NavbarLink>
          </NavbarCollapse>

          <Button
            as={Link}
            to="/auth/auth1/login"
            color={'primary'}
            className="px-6 xl:flex hidden"
            size="lg"
          >
            Login
          </Button>
        </Navbar>
      </header>
    </>
  );
};

export default Header;

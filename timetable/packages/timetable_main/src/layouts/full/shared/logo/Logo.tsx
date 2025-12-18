
import AcadSyncLogo from '/src/assets/images/logos/timelyLOGO-removebg-preview.png'
import { Link } from "react-router";

const Logo = () => {
  return (
   <Link to={'/'}>
      <img src={AcadSyncLogo} alt="ACADSYNC Logo" className="h-12" />
    </Link>
  )
}

export default Logo

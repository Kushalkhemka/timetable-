import { useContext } from 'react';
import { Link } from 'react-router';
import { CustomizerContext } from 'src/context/CustomizerContext';
const FullLogo = () => {
  const { isCollapse } = useContext(CustomizerContext);
  const isMini = isCollapse === 'mini-sidebar';
  const svgWidth = isMini ? 150 : 210;
  const svgHeight = isMini ? 40 : 60;
  return (
    <Link to={'/'} className="ms-0">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 420 120"
        width={svgWidth}
        height={svgHeight}
        aria-label="AcadSync Logo"
      >
        <g transform="translate(10,12)">
          <rect x="0" y="0" width="96" height="96" rx="14" fill="var(--primary)" />
          <g transform="translate(12,12)" fill="#ffffff">
            <rect x="0" y="0" width="16" height="16" rx="3" />
            <rect x="20" y="0" width="16" height="16" rx="3" />
            <rect x="40" y="0" width="16" height="16" rx="3" />
            <rect x="0" y="20" width="16" height="16" rx="3" />
            <rect x="20" y="20" width="16" height="16" rx="3" />
            <rect x="40" y="20" width="16" height="16" rx="3" />
          </g>
          <g transform="translate(52,52)">
            <circle cx="22" cy="22" r="20" fill="#ffffff" />
            <circle cx="22" cy="22" r="18" fill="var(--primary)" />
            <rect x="21.5" y="7" width="3" height="16" rx="1" transform="rotate(45 23.5 15)" fill="#ffffff" />
            <rect x="20" y="21" width="6" height="2" rx="1" fill="#ffffff" />
          </g>
          <g transform="translate(68,6)" fill="none" stroke="#ffffff" strokeWidth="2">
            <path d="M0 24 A24 24 0 0 1 24 0" />
            <path d="M6 24 A18 18 0 0 1 24 6" />
            <path d="M12 24 A12 12 0 0 1 24 12" />
          </g>
        </g>
        <g transform="translate(130,70)">
          <text
            x="0"
            y="0"
            dominantBaseline="middle"
            fontFamily="Segoe UI, Roboto, Arial"
            fontWeight={700}
            fontSize={50}
            fill="var(--dark)"
          >
            AcadSync
          </text>
        </g>
      </svg>
    </Link>
  );
};

export default FullLogo;

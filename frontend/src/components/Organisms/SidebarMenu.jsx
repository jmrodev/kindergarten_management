import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Menu from '../Molecules/Menu';
import MenuItem from '../Molecules/MenuItem';
import Text from '../Atoms/Text';
import SvgIcon from '../Atoms/SvgIcon';
import Button from '../Atoms/Button';
import './organisms.css';

const SidebarMenu = ({
  items,
  collapsed = false,
  onToggleCollapse,
  title = 'Menu Principal',
  currentPath,
  ...props
}) => {
  const location = useLocation();
  const actualCurrentPath = currentPath || location.pathname;

  return (
    <Sidebar collapsed={collapsed} {...props}>
      <div className="sidebar-header">
        {!collapsed && <Text variant="h3" className="menu-title">{title}</Text>}
        <Button
          variant="secondary"
          size="small"
          className="sidebar-toggle-btn"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? '→' : '←'}
        </Button>
      </div>
      <Menu>
        {items.map((item, index) => (
          <MenuItem
            key={index}
            href={item.path}
            active={actualCurrentPath === item.path}
            onClick={item.onClick}
          >
            {item.icon && <SvgIcon src={item.icon} size={18} className="menu-item-icon" />}
            {!collapsed && <span className="menu-item-text">{item.label}</span>}
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};

export default SidebarMenu;
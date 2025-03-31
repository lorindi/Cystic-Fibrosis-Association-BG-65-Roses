'use client';
import './admin.css';
import { useState, useEffect } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { PanelMenu } from 'primereact/panelmenu';
import { MenuItem } from 'primereact/menuitem';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Divider } from 'primereact/divider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');

  useEffect(() => {
    // Set active menu item based on current path
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const currentPath = path.split('/').filter(Boolean)[1] || '';
      setActiveMenuItem(currentPath);
    }
  }, []);

  const menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-th-large',
      url: '/admin',
      className: activeMenuItem === '' ? 'active-menu-item' : ''
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      className: activeMenuItem === 'users' ? 'active-menu-item' : '',
      items: [
        {
          label: 'All Users',
          icon: 'pi pi-list',
          url: '/admin/users'
        },
        {
          label: 'Groups',
          icon: 'pi pi-sitemap',
          url: '/admin/users/groups'
        }
      ]
    },
    {
      label: 'Content',
      icon: 'pi pi-file-edit',
      className: activeMenuItem === 'news' || activeMenuItem === 'blog' || activeMenuItem === 'recipes' || activeMenuItem === 'stories' ? 'active-menu-item parent-active' : '',
      items: [
        {
          label: 'News',
          icon: 'pi pi-megaphone',
          url: '/admin/news',
          template: (item) => (
            <a className="p-menuitem-link" href={item.url}>
              <span className="p-menuitem-icon"><i className={item.icon}></i></span>
              <span className="p-menuitem-text">{item.label}</span>
              <Badge value="2" severity="success" className="ml-auto" />
            </a>
          )
        },
        {
          label: 'Blog',
          icon: 'pi pi-pencil',
          url: '/admin/blog'
        },
        {
          label: 'Recipes',
          icon: 'pi pi-book',
          url: '/admin/recipes'
        },
        {
          label: 'Stories',
          icon: 'pi pi-comment',
          url: '/admin/stories'
        }
      ]
    },
    {
      label: 'Events',
      icon: 'pi pi-calendar',
      className: activeMenuItem === 'campaigns' || activeMenuItem === 'initiatives' || activeMenuItem === 'conferences' || activeMenuItem === 'activities' ? 'active-menu-item parent-active' : '',
      items: [
        {
          label: 'Campaigns',
          icon: 'pi pi-flag',
          url: '/admin/campaigns'
        },
        {
          label: 'Initiatives',
          icon: 'pi pi-heart',
          url: '/admin/initiatives'
        },
        {
          label: 'Conferences',
          icon: 'pi pi-users',
          url: '/admin/conferences'
        },
        {
          label: 'Activities',
          icon: 'pi pi-ticket',
          url: '/admin/activities'
        }
      ]
    },
    {
      label: 'Store',
      icon: 'pi pi-shopping-cart',
      className: activeMenuItem === 'store' ? 'active-menu-item parent-active' : '',
      items: [
        {
          label: 'Items',
          icon: 'pi pi-box',
          url: '/admin/store/items'
        },
        {
          label: 'Donors',
          icon: 'pi pi-heart-fill',
          url: '/admin/store/donors'
        },
        {
          label: 'Donations',
          icon: 'pi pi-money-bill',
          url: '/admin/store/donations',
          template: (item) => (
            <a className="p-menuitem-link" href={item.url}>
              <span className="p-menuitem-icon"><i className={item.icon}></i></span>
              <span className="p-menuitem-text">{item.label}</span>
              <Badge value="5" severity="info" className="ml-auto" />
            </a>
          )
        }
      ]
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      url: '/admin/settings',
      className: activeMenuItem === 'settings' ? 'active-menu-item' : ''
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-column">
      {/* Header */}
      <header className="bg-white shadow-2 fixed top-0 left-0 right-0 h-16 z-50 flex align-items-center justify-content-between px-4">
        <div className="flex align-items-center">
          <Button 
            icon={sidebarVisible ? "pi pi-arrow-left" : "pi pi-arrow-right"}
            onClick={() => setSidebarVisible(!sidebarVisible)} 
            className="p-button-rounded p-button-text p-button-sm mr-2"
            tooltip={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            tooltipOptions={{ position: 'bottom' }}
          />
          <div className="text-xl font-semibold text-primary ml-2 flex align-items-center">
            <i className="pi pi-shield mr-2"></i>
            <span>65 Roses Admin</span>
          </div>
        </div>
        <div className="flex align-items-center gap-3">
          <Button icon="pi pi-search" className="p-button-rounded p-button-text" tooltip="Search" tooltipOptions={{ position: 'bottom' }} />
          <Button icon="pi pi-envelope" className="p-button-rounded p-button-text" tooltip="Messages" tooltipOptions={{ position: 'bottom' }} badge="2" badgeClassName="p-badge-warning" />
          <Button icon="pi pi-bell" className="p-button-rounded p-button-text" tooltip="Notifications" tooltipOptions={{ position: 'bottom' }} badge="3" badgeClassName="p-badge-danger" />
          <Divider layout="vertical" className="h-2rem mx-2" />
          <div className="flex align-items-center cursor-pointer">
            <Avatar icon="pi pi-user" className="bg-primary" size="large" shape="circle" />
            <span className="ml-2 font-medium hidden md:block">Admin User</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        className="p-sidebar-sm border-right-1 border-300"
        showCloseIcon={false}
        modal={false}
        style={{ 
          top: '4rem', 
        //   height: 'calc(100vh - 4rem)',
          width: '300px',
          boxShadow: '0 0 10px rgba(0,0,0,0.05)'
        }}
      >
        <div className="p-2 sidebar-content">
          <PanelMenu model={menuItems} className="w-full border-none admin-menu" multiple={false} />
          
          <Divider className="my-3" />
          
          <div className="p-3 mt-3 bg-primary bg-opacity-10 border-round flex align-items-center">
            <i className="pi pi-info-circle text-primary mr-2"></i>
            <span className="text-sm">Need help? Check the <a href="#" className="text-primary font-medium">Admin Guide</a></span>
          </div>
        </div>
      </Sidebar>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 p-4 ${sidebarVisible ? 'ml-[280px]' : ''}`}>
        <div className="card p-4 shadow-1 border-round">
          {children}
        </div>
      </main>


    </div>
  );
}
'use client';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export default function AdminDashboard() {
  return (<div className="flex"></div>
    // <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    //   <Card className="shadow-sm">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
    //         <p className="text-3xl font-bold text-primary mt-2">256</p>
    //       </div>
    //       <i className="pi pi-users text-4xl text-primary opacity-80"></i>
    //     </div>
    //     <p className="text-sm text-gray-500 mt-4">+12% from last month</p>
    //   </Card>

    //   <Card className="shadow-sm">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-700">Active Campaigns</h3>
    //         <p className="text-3xl font-bold text-green-500 mt-2">8</p>
    //       </div>
    //       <i className="pi pi-flag text-4xl text-green-500 opacity-80"></i>
    //     </div>
    //     <p className="text-sm text-gray-500 mt-4">3 campaigns ending soon</p>
    //   </Card>

    //   <Card className="shadow-sm">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-700">Total Donations</h3>
    //         <p className="text-3xl font-bold text-blue-500 mt-2">$45,250</p>
    //       </div>
    //       <i className="pi pi-money-bill text-4xl text-blue-500 opacity-80"></i>
    //     </div>
    //     <p className="text-sm text-gray-500 mt-4">+25% from last month</p>
    //   </Card>

    //   <Card className="shadow-sm">
    //     <div className="flex items-center justify-between">
    //       <div>
    //         <h3 className="text-lg font-semibold text-gray-700">Pending Approvals</h3>
    //         <p className="text-3xl font-bold text-yellow-500 mt-2">12</p>
    //       </div>
    //       <i className="pi pi-clock text-4xl text-yellow-500 opacity-80"></i>
    //     </div>
    //     <p className="text-sm text-gray-500 mt-4">5 blog posts, 7 recipes</p>
    //   </Card>

    //   <Card className="shadow-sm md:col-span-2">
    //     <div className="flex items-center justify-between mb-4">
    //       <h3 className="text-lg font-semibold text-gray-700">Recent Activities</h3>
    //       <Button icon="pi pi-refresh" className="p-button-text" />
    //     </div>
    //     <div className="space-y-4">
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-user-plus text-green-500"></i>
    //         <div>
    //           <p className="font-medium">New user registered</p>
    //           <p className="text-sm text-gray-500">2 minutes ago</p>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-heart-fill text-red-500"></i>
    //         <div>
    //           <p className="font-medium">New donation received</p>
    //           <p className="text-sm text-gray-500">15 minutes ago</p>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-pencil text-blue-500"></i>
    //         <div>
    //           <p className="font-medium">New blog post submitted</p>
    //           <p className="text-sm text-gray-500">1 hour ago</p>
    //         </div>
    //       </div>
    //     </div>
    //   </Card>

    //   <Card className="shadow-sm md:col-span-2">
    //     <div className="flex items-center justify-between mb-4">
    //       <h3 className="text-lg font-semibold text-gray-700">Upcoming Events</h3>
    //       <Button icon="pi pi-calendar" className="p-button-text" />
    //     </div>
    //     <div className="space-y-4">
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-flag text-primary"></i>
    //         <div>
    //           <p className="font-medium">Fundraising Campaign Launch</p>
    //           <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-users text-green-500"></i>
    //         <div>
    //           <p className="font-medium">Medical Conference</p>
    //           <p className="text-sm text-gray-500">Next Monday at 9:00 AM</p>
    //         </div>
    //       </div>
    //       <div className="flex items-center gap-4">
    //         <i className="pi pi-heart text-red-500"></i>
    //         <div>
    //           <p className="font-medium">Support Group Meeting</p>
    //           <p className="text-sm text-gray-500">Next Wednesday at 2:00 PM</p>
    //         </div>
    //       </div>
    //     </div>
    //   </Card>
    // </div>
  );
}
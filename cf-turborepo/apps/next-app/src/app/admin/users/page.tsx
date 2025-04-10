export default function UsersPage() {
  return ( <div className="flex"></div>
    // <div>
    //   <div className="flex justify-between items-center mb-6">
    //     <h1 className="text-2xl font-bold">Users Management</h1>
    //     <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    //       Add New User
    //     </button>
    //   </div>

    //   <div className="bg-white rounded-lg shadow">
    //     <table className="min-w-full">
    //       <thead>
    //         <tr className="border-b">
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
    //           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
    //           <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
    //         </tr>
    //       </thead>
    //       <tbody className="divide-y divide-gray-200">
    //         {sampleUsers.map((user) => (
    //           <tr key={user.id}>
    //             <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
    //             <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
    //             <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
    //             <td className="px-6 py-4 whitespace-nowrap">
    //               <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    //                 user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    //               }`}>
    //                 {user.status}
    //               </span>
    //             </td>
    //             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
    //               <button className="text-blue-600 hover:text-blue-900 mr-2">Edit</button>
    //               <button className="text-red-600 hover:text-red-900">Delete</button>
    //             </td>
    //           </tr>
    //         ))}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
  );
}

// Sample data
const sampleUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', role: 'Viewer', status: 'Active' },
]; 
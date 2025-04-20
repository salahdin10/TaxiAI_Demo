import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { Search, Edit, Eye, Trash, Printer, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

type UserList = {
  data: User[];
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
};

type PageProps = InertiaPageProps & {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    } | null;
  };
  users: UserList;
};

function Users() {
  const { auth, users } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredUsers = users.data.filter((user: User) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Open modal and set the user id to delete
  const openDeleteModal = (userId: number) => {
    setDeleteUserId(userId);
    const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  // Called when deletion is confirmed in the modal
  const handleModalDelete = () => {
    if (deleteUserId !== null) {
      router.delete(route('admin.users.destroy', deleteUserId), {
        preserveScroll: true,
      });
      const modal = document.getElementById('my_modal_2') as HTMLDialogElement | null;
      if (modal) modal.close();
      setDeleteUserId(null);
    }
  };
  // Paste this inside your existing Users component

  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const openViewModal = (user: User) => {
    setViewUser(user);
    const modal = document.getElementById('view_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

// Edit Modal
  const openEditModal = (user: User) => {
    setEditUser({ ...user });
    const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editUser) {
      setEditUser({
        ...editUser,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleEditSubmit = () => {
    if (editUser) {
      router.put(route('admin.users.update', editUser.id), {
        name: editUser.name,
        email: editUser.email,
        preserveScroll: true,
      });
      const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
      if (modal) modal.close();
    }
  };


  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            User Management
          </h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                placeholder="Search users..."
              />
            </div>
            <button
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              onClick={() => window.print()}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      }
    >
      <Head title="Users" />

      {showAlert && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <div className="flex justify-between items-center">
            <p>Please remember to log out when you finish your session.</p>
            <button onClick={() => setShowAlert(false)} className="text-blue-700 hover:text-blue-900">
              &times;
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Registered Users
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredUsers.length} of {users.total} users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openViewModal(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => openDeleteModal(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Page {users.current_page} of {users.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                disabled={users.current_page === 1}
                className={`px-4 py-2 rounded-md flex items-center ${
                  users.current_page === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                disabled={users.current_page === users.last_page}
                className={`px-4 py-2 rounded-md flex items-center ${
                  users.current_page === users.last_page
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
      <dialog id="my_modal_2" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirm Deletion
          </h3>
          <p className="py-4">Are you sure you want to delete this user?</p>
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button className="btn" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="btn bg-red-600 text-white hover:bg-red-700" onClick={handleModalDelete}>
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* View User Modal */}
      <dialog id="view_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-blue-600">User Details</h3>
          {viewUser && (
            <div className="mt-4 space-y-2">
              <p><strong>ID:</strong> {viewUser.id}</p>
              <p><strong>Name:</strong> {viewUser.name}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Joined:</strong> {new Date(viewUser.created_at).toLocaleDateString()}</p>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit User Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-green-600">Edit User</h3>
          {editUser && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  value={editUser.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  name="email"
                  value={editUser.email}
                  onChange={handleEditChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          )}
          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button className="btn">Cancel</button>
              <button className="btn bg-green-600 text-white hover:bg-green-700" onClick={handleEditSubmit}>
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </AuthenticatedLayout>
  );
}


export default Users;

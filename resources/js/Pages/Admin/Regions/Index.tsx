import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import {Search, Edit, Eye, Trash, Printer, ChevronLeft, ChevronRight, AlertTriangle, Plus} from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
type Region = {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
};

type RegionList = {
  data: Region[];
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
};

type PageProps = InertiaPageProps & {
  regions: RegionList;
};

export default function RegionManagement() {
  const { regions } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [deleteRegionId, setDeleteRegionId] = useState<number | null>(null);
  const [viewRegion, setViewRegion] = useState<Region | null>(null);
  const [editRegion, setEditRegion] = useState<Region | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);


  // Create Form Handling
  const { data: createData, setData: setCreateData, post, processing, errors, reset } = useForm({
    name: '',
    code: '',
    description: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.regions.store'), {
      onSuccess: () => {
        toast.success('Region created successfully!')
        setShowCreateModal(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to create region!');
      }
    });
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredRegions = regions.data.filter((region: Region) =>
    region.name.toLowerCase().includes(search.toLowerCase()) ||
    region.code.toLowerCase().includes(search.toLowerCase()) ||
    region.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const openDeleteModal = (regionId: number) => {
    setDeleteRegionId(regionId);
    const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleModalDelete = () => {
    if (deleteRegionId !== null) {
      router.delete(route('admin.regions.destroy', deleteRegionId), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Region deleted successfully!');
          const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
          setDeleteRegionId(null);
        },
        onError: () => {
          toast.error('failed to delete region!');
        }
      });
    }
  };

  const openViewModal = (region: Region) => {
    setViewRegion(region);
    const modal = document.getElementById('view_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const openEditModal = (region: Region) => {
    setEditRegion({ ...region });
    const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editRegion) {
      setEditRegion({
        ...editRegion,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleEditSubmit = () => {
    if (editRegion) {
      router.put(route('admin.regions.update', editRegion.id), editRegion, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Region updated successfully!');
          const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
        },
        onError: () => {
          toast.error('Failed to update region!');
        },
      });
    }
  };




  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Region Management
          </h2>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                placeholder="Search regions..."
              />
            </div>
            <button
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Region
            </button>
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
      <Head title="Regions" />

      {showAlert && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <div className="flex justify-between items-center">
            <p>Please verify region information before making changes.</p>
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
              Registered Regions
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredRegions.length} of {regions.total} regions
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
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRegions.map((region: Region) => (
                <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {region.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {region.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {region.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {region.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(region.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openViewModal(region)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(region)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(region.id)}
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
              Page {regions.current_page} of {regions.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                disabled={regions.current_page === 1}
                className={`px-4 py-2 rounded-md flex items-center ${
                  regions.current_page === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                disabled={regions.current_page === regions.last_page}
                className={`px-4 py-2 rounded-md flex items-center ${
                  regions.current_page === regions.last_page
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

      {/* Delete Modal */}
      <dialog id="delete_modal" className="modal">
        <div className="modal-box border border-red-300 bg-white rounded-2xl shadow-2xl animate__animated animate__fadeInDown">
          <h3 className="text-xl font-bold flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirm Deletion
          </h3>
          <p className="py-4 text-gray-700">Are you sure you want to delete this region?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button
                className="btn border border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2"
                onClick={() => setDeleteRegionId(null)}
              >
                Cancel
              </button>
              <button
                className="btn bg-red-600 text-white hover:bg-red-700 rounded-xl px-4 py-2 shadow-md"
                onClick={handleModalDelete}
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* View Modal */}
      <dialog id="view_modal" className="modal">
        <div className="modal-box bg-white rounded-2xl shadow-2xl animate__animated animate__fadeInDown">
          <h3 className="text-xl font-bold text-blue-600 mb-4">📄 Region Details</h3>
          {viewRegion && (
            <div className="mt-2 space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold">ID:</span> {viewRegion.id}</p>
              <p><span className="font-semibold">Name:</span> {viewRegion.name}</p>
              <p><span className="font-semibold">Code:</span> {viewRegion.code}</p>
              <p><span className="font-semibold">Description:</span> {viewRegion.description}</p>
              <p><span className="font-semibold">Created:</span> {new Date(viewRegion.created_at).toLocaleDateString()}</p>
            </div>
          )}
          <div className="modal-action mt-6">
            <form method="dialog">
              <button className="btn border border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2">Close</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Edit Modal */}
      <dialog id="edit_modal" className="modal">
        <div className="modal-box bg-white border border-green-200 rounded-2xl shadow-2xl animate__animated animate__fadeInDown">
          <h3 className="text-xl font-bold text-green-600 mb-4">✏️ Edit Region</h3>
          {editRegion && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Name</label>
                <input
                  name="name"
                  value={editRegion.name}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Code</label>
                <input
                  name="code"
                  value={editRegion.code}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editRegion.description}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  rows={3}
                />
              </div>
            </div>
          )}
          <div className="modal-action mt-6">
            <form method="dialog" className="flex gap-4">
              <button className="btn border border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2">Cancel</button>
              <button
                className="btn bg-green-600 text-white hover:bg-green-700 rounded-xl px-4 py-2 shadow-md"
                onClick={handleEditSubmit}
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </dialog>


      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${showCreateModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setShowCreateModal(false)}></div>

      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        showCreateModal ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-green-700">
              🚀 Create New Region
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                name="name"
                value={createData.name}
                onChange={(e) => setCreateData('name', e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Code (MA-XXX)</label>
              <input
                name="code"
                value={createData.code}
                onChange={(e) => setCreateData('code', e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="MA-CAS"
              />
              {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={createData.description}
                onChange={(e) => setCreateData('description', e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                rows={3}
                placeholder="Write something meaningful..."
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                className="btn border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-2 flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-green-600 text-white hover:bg-green-700 transition rounded-xl px-5 py-2 flex-1 shadow-md"
                disabled={processing}
              >
                {processing ? 'Creating...' : 'Create Region'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthenticatedLayout>
  );
}

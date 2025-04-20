import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { Search, Edit, Eye, Trash, Printer, ChevronLeft, ChevronRight, AlertTriangle, Plus } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Zone = {
  id: number;
  name: string;
  region: {
    id: number;
    name: string;
  };
};

type Taxi = {
  id: number;
  model: string;
  mark: string;
  license_plate: string;
  zone_id: number;
  zone: Zone;
  created_at: string;
};

type TaxiList = {
  data: Taxi[];
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
};

type PageProps = InertiaPageProps & {
  taxis: TaxiList;
  zones: Array<Zone>;
};

export default function TaxiManagement() {
  const { taxis, zones } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [deleteTaxiId, setDeleteTaxiId] = useState<number | null>(null);
  const [viewTaxi, setViewTaxi] = useState<Taxi | null>(null);
  const [editTaxi, setEditTaxi] = useState<Taxi | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'day' | 'month' | 'year'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Create Form Handling
  const { data: createData, setData: setCreateData, post, processing, errors, reset } = useForm({
    model: '',
    mark: '',
    license_plate: '',
    zone_id: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.taxis.store'), {
      onSuccess: () => {
        toast.success('Taxi created successfully!');
        setShowCreateModal(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to create taxi!');
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredTaxis = taxis.data.filter((taxi: Taxi) => {
    const matchesSearch =
      taxi.model.toLowerCase().includes(search.toLowerCase()) ||
      taxi.mark.toLowerCase().includes(search.toLowerCase()) ||
      taxi.license_plate.toLowerCase().includes(search.toLowerCase()) ||
      taxi.zone.name.toLowerCase().includes(search.toLowerCase()) ||
      taxi.zone.region.name.toLowerCase().includes(search.toLowerCase());

    const taxiDate = new Date(taxi.created_at);
    const filterDate = new Date(selectedDate);

    let matchesDate = false;

    if (dateFilter === 'day') {
      matchesDate =
        taxiDate.getFullYear() === filterDate.getFullYear() &&
        taxiDate.getMonth() === filterDate.getMonth() &&
        taxiDate.getDate() === filterDate.getDate();
    } else if (dateFilter === 'month') {
      matchesDate =
        taxiDate.getFullYear() === filterDate.getFullYear() &&
        taxiDate.getMonth() === filterDate.getMonth();
    } else if (dateFilter === 'year') {
      matchesDate = taxiDate.getFullYear() === filterDate.getFullYear();
    }

    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const openDeleteModal = (taxiId: number) => {
    setDeleteTaxiId(taxiId);
    const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleModalDelete = () => {
    if (deleteTaxiId !== null) {
      router.delete(route('admin.taxis.destroy', deleteTaxiId), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Taxi deleted successfully!');
          const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
          setDeleteTaxiId(null);
        },
        onError: () => {
          toast.error('Failed to delete taxi!');
        }
      });
    }
  };

  const openViewModal = (taxi: Taxi) => {
    setViewTaxi(taxi);
    const modal = document.getElementById('view_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const openEditModal = (taxi: Taxi) => {
    setEditTaxi({ ...taxi });
    const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editTaxi) {
      setEditTaxi({
        ...editTaxi,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleEditSubmit = () => {
    if (editTaxi) {
      router.put(route('admin.taxis.update', editTaxi.id), editTaxi, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Taxi updated successfully!');
          const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
        },
        onError: () => {
          toast.error('Failed to update taxi!');
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Taxi Management
          </h2>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  placeholder="Search taxis..."
                />
              </div>

              <div className="flex space-x-2">
                <div className="relative">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as 'day' | 'month' | 'year')}
                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="relative">
                  {dateFilter === 'day' && (
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  {dateFilter === 'month' && (
                    <input
                      type="month"
                      value={selectedDate.substring(0, 7)}
                      onChange={(e) => setSelectedDate(e.target.value + '-01')}
                      className="pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                  {dateFilter === 'year' && (
                    <select
                      value={selectedDate.substring(0, 4)}
                      onChange={(e) => setSelectedDate(e.target.value + '-01-01')}
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedDate(new Date().toISOString().split('T')[0]);
                    setDateFilter('day');
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Taxi
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
      <Head title="Taxis" />

      {showAlert && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <div className="flex justify-between items-center">
            <p>Please verify taxi information before making changes.</p>
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
              Registered Taxis
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredTaxis.length} of {taxis.total} taxis
              {dateFilter !== 'day' && ` (Filtered by ${dateFilter})`}
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
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mark
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  License Plate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Region
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
              {filteredTaxis.map((taxi: Taxi) => (
                <tr key={taxi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {taxi.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {taxi.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {taxi.mark}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {taxi.license_plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {taxi.zone.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {taxi.zone.region.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(taxi.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openViewModal(taxi)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(taxi)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(taxi.id)}
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
              Page {taxis.current_page} of {taxis.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                disabled={taxis.current_page === 1}
                className={`px-4 py-2 rounded-md flex items-center ${
                  taxis.current_page === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                disabled={taxis.current_page === taxis.last_page}
                className={`px-4 py-2 rounded-md flex items-center ${
                  taxis.current_page === taxis.last_page
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
          <p className="py-4 text-gray-700">Are you sure you want to delete this taxi?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button
                className="btn border border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2"
                onClick={() => setDeleteTaxiId(null)}
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
          <h3 className="text-xl font-bold text-blue-600 mb-4">📄 Taxi Details</h3>
          {viewTaxi && (
            <div className="mt-2 space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold">ID:</span> {viewTaxi.id}</p>
              <p><span className="font-semibold">Model:</span> {viewTaxi.model}</p>
              <p><span className="font-semibold">Mark:</span> {viewTaxi.mark}</p>
              <p><span className="font-semibold">License Plate:</span> {viewTaxi.license_plate}</p>
              <p><span className="font-semibold">Zone:</span> {viewTaxi.zone.name}</p>
              <p><span className="font-semibold">Region:</span> {viewTaxi.zone.region.name}</p>
              <p><span className="font-semibold">Created:</span> {new Date(viewTaxi.created_at).toLocaleDateString()}</p>
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
          <h3 className="text-xl font-bold text-green-600 mb-4">✏️ Edit Taxi</h3>
          {editTaxi && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Model</label>
                <input
                  name="model"
                  value={editTaxi.model}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Mark</label>
                <input
                  name="mark"
                  value={editTaxi.mark}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">License Plate</label>
                <input
                  name="license_plate"
                  value={editTaxi.license_plate}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Zone</label>
                <select
                  name="zone_id"
                  value={editTaxi.zone_id}
                  onChange={handleEditChange}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.region.name})
                    </option>
                  ))}
                </select>
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

      {/* Create Modal */}
      <dialog open={showCreateModal} className="modal">
        <div className="modal-box bg-white shadow-2xl border border-gray-200 rounded-2xl animate__animated animate__fadeInDown">
          <h3 className="text-2xl font-extrabold text-green-700 mb-4 text-center tracking-wide">
            🚀 Create New Taxi
          </h3>

          <form onSubmit={handleCreateSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Model</label>
                <input
                  name="model"
                  value={createData.model}
                  onChange={(e) => setCreateData('model', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Mark</label>
                <input
                  name="mark"
                  value={createData.mark}
                  onChange={(e) => setCreateData('mark', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                />
                {errors.mark && <p className="text-red-500 text-sm mt-1">{errors.mark}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">License Plate</label>
                <input
                  name="license_plate"
                  value={createData.license_plate}
                  onChange={(e) => setCreateData('license_plate', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                />
                {errors.license_plate && <p className="text-red-500 text-sm mt-1">{errors.license_plate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">Zone</label>
                <select
                  name="zone_id"
                  value={createData.zone_id}
                  onChange={(e) => setCreateData('zone_id', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                >
                  <option value="">Select Zone</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} ({zone.region.name})
                    </option>
                  ))}
                </select>
                {errors.zone_id && <p className="text-red-500 text-sm mt-1">{errors.zone_id}</p>}
              </div>
            </div>

            <div className="modal-action mt-8 flex justify-end gap-4">
              <button
                type="button"
                className="btn border border-gray-300 hover:bg-gray-100 transition rounded-xl px-5 py-2"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-green-600 text-white hover:bg-green-700 transition rounded-xl px-5 py-2 shadow-md"
                disabled={processing}
              >
                {processing ? 'Creating...' : 'Create Taxi'}
              </button>
            </div>
          </form>
        </div>
      </dialog>

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

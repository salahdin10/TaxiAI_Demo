import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { Search, Edit, Eye, Trash, Printer, ChevronLeft, ChevronRight, AlertTriangle, Plus } from 'lucide-react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useForm } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Taxi = {
  id: number;
  license_plate: string;
};

type Driver = {
  id: number;
  first_name: string;
  last_name: string;
  permis_confidence: number;
  cin: string;
  license_number: string;
  phone: string;
  email: string;
  taxi_id: number;
  taxi: Taxi;
  created_at: string;
};

type DriverList = {
  data: Driver[];
  current_page: number;
  from: number;
  to: number;
  total: number;
  last_page: number;
};

type PageProps = InertiaPageProps & {
  drivers: DriverList;
  taxis: Taxi[];
};

export default function DriverManagement() {
  const { drivers, taxis } = usePage<PageProps>().props;
  const [search, setSearch] = useState('');
  const [showAlert, setShowAlert] = useState(true);
  const [deleteDriverId, setDeleteDriverId] = useState<number | null>(null);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<'day' | 'month' | 'year'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Create Form Handling
  const { data: createData, setData: setCreateData, post, processing, errors, reset } = useForm({
    first_name: '',
    last_name: '',
    permis_confidence: 0,
    cin: '',
    license_number: '',
    phone: '',
    email: '',
    taxi_id: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.drivers.store'), {
      onSuccess: () => {
        toast.success('Driver created successfully!');
        setShowCreateModal(false);
        reset();
      },
      onError: () => {
        toast.error('Failed to create driver!');
      }
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredDrivers = drivers.data.filter((driver: Driver) => {
    const matchesSearch =
      `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      driver.cin.toLowerCase().includes(search.toLowerCase()) ||
      driver.license_number.toLowerCase().includes(search.toLowerCase()) ||
      driver.taxi.license_plate.toLowerCase().includes(search.toLowerCase());

    const driverDate = new Date(driver.created_at);
    const filterDate = new Date(selectedDate);

    let matchesDate = false;

    if (dateFilter === 'day') {
      matchesDate =
        driverDate.getFullYear() === filterDate.getFullYear() &&
        driverDate.getMonth() === filterDate.getMonth() &&
        driverDate.getDate() === filterDate.getDate();
    } else if (dateFilter === 'month') {
      matchesDate =
        driverDate.getFullYear() === filterDate.getFullYear() &&
        driverDate.getMonth() === filterDate.getMonth();
    } else if (dateFilter === 'year') {
      matchesDate = driverDate.getFullYear() === filterDate.getFullYear();
    }

    return matchesSearch && matchesDate;
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const openDeleteModal = (driverId: number) => {
    setDeleteDriverId(driverId);
    const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleModalDelete = () => {
    if (deleteDriverId !== null) {
      router.delete(route('admin.drivers.destroy', deleteDriverId), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Driver deleted successfully!');
          const modal = document.getElementById('delete_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
          setDeleteDriverId(null);
        },
        onError: () => {
          toast.error('Failed to delete driver!');
        }
      });
    }
  };

  const openViewModal = (driver: Driver) => {
    setViewDriver(driver);
    const modal = document.getElementById('view_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const openEditModal = (driver: Driver) => {
    setEditDriver({ ...driver });
    const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (editDriver) {
      setEditDriver({
        ...editDriver,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleEditSubmit = () => {
    if (editDriver) {
      router.put(route('admin.drivers.update', editDriver.id), editDriver, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Driver updated successfully!');
          const modal = document.getElementById('edit_modal') as HTMLDialogElement | null;
          if (modal) modal.close();
        },
        onError: () => {
          toast.error('Failed to update driver!');
        },
      });
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Driver Management
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
                  placeholder="Search drivers..."
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
              New Driver
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
      <Head title="Drivers" />

      {showAlert && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
          <div className="flex justify-between items-center">
            <p>Please verify driver information before making changes.</p>
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
              Registered Drivers
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredDrivers.length} of {drivers.total} drivers
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
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  CIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Taxi
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
              {filteredDrivers.map((driver: Driver) => (
                <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {driver.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.first_name} {driver.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.cin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.license_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.permis_confidence}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {driver.taxi.license_plate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(driver.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => openViewModal(driver)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        title="View"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(driver)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(driver.id)}
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
              Page {drivers.current_page} of {drivers.last_page}
            </div>
            <div className="flex space-x-2">
              <button
                disabled={drivers.current_page === 1}
                className={`px-4 py-2 rounded-md flex items-center ${
                  drivers.current_page === 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                disabled={drivers.current_page === drivers.last_page}
                className={`px-4 py-2 rounded-md flex items-center ${
                  drivers.current_page === drivers.last_page
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
          <p className="py-4 text-gray-700">Are you sure you want to delete this driver?</p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-4">
              <button
                className="btn border border-gray-300 hover:bg-gray-100 rounded-xl px-4 py-2"
                onClick={() => setDeleteDriverId(null)}
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
          <h3 className="text-xl font-bold text-blue-600 mb-4">📄 Driver Details</h3>
          {viewDriver && (
            <div className="mt-2 space-y-3 text-sm text-gray-700">
              <p><span className="font-semibold">ID:</span> {viewDriver.id}</p>
              <p><span className="font-semibold">Name:</span> {viewDriver.first_name} {viewDriver.last_name}</p>
              <p><span className="font-semibold">CIN:</span> {viewDriver.cin}</p>
              <p><span className="font-semibold">License:</span> {viewDriver.license_number}</p>
              <p><span className="font-semibold">Confidence:</span> {viewDriver.permis_confidence}%</p>
              <p><span className="font-semibold">Taxi:</span> {viewDriver.taxi.license_plate}</p>
              <p><span className="font-semibold">Phone:</span> {viewDriver.phone}</p>
              <p><span className="font-semibold">Email:</span> {viewDriver.email}</p>
              <p><span className="font-semibold">Created:</span> {new Date(viewDriver.created_at).toLocaleDateString()}</p>
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
          <h3 className="text-xl font-bold text-green-600 mb-4">✏️ Edit Driver</h3>
          {editDriver && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    name="first_name"
                    value={editDriver.first_name}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    name="last_name"
                    value={editDriver.last_name}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">CIN</label>
                  <input
                    name="cin"
                    value={editDriver.cin}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">License Number</label>
                  <input
                    name="license_number"
                    value={editDriver.license_number}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Confidence</label>
                  <input
                    type="number"
                    name="permis_confidence"
                    value={editDriver.permis_confidence}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Taxi</label>
                  <select
                    name="taxi_id"
                    value={editDriver.taxi_id}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    {taxis.map((taxi) => (
                      <option key={taxi.id} value={taxi.id}>
                        {taxi.license_plate}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Phone</label>
                  <input
                    name="phone"
                    value={editDriver.phone}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">Email</label>
                  <input
                    name="email"
                    value={editDriver.email}
                    onChange={handleEditChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                </div>
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
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${showCreateModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
           onClick={() => setShowCreateModal(false)}></div>

      <div className={`fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        showCreateModal ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-green-700">
              🚀 Create New Driver
            </h3>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-500 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">First Name</label>
                <input
                  name="first_name"
                  value={createData.first_name}
                  onChange={(e) => setCreateData('first_name', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Last Name</label>
                <input
                  name="last_name"
                  value={createData.last_name}
                  onChange={(e) => setCreateData('last_name', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">CIN</label>
                <input
                  name="cin"
                  value={createData.cin}
                  onChange={(e) => setCreateData('cin', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.cin && <p className="text-red-500 text-sm mt-1">{errors.cin}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">License Number</label>
                <input
                  name="license_number"
                  value={createData.license_number}
                  onChange={(e) => setCreateData('license_number', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.license_number && <p className="text-red-500 text-sm mt-1">{errors.license_number}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Confidence (%)</label>
                <input
                  type="number"
                  name="permis_confidence"
                  value={createData.permis_confidence}
                  onChange={(e) => setCreateData('permis_confidence', Number(e.target.value))}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                  min="0"
                  max="100"
                />
                {errors.permis_confidence && <p className="text-red-500 text-sm mt-1">{errors.permis_confidence}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Taxi</label>
                <select
                  name="taxi_id"
                  value={createData.taxi_id}
                  onChange={(e) => setCreateData('taxi_id', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">Select Taxi</option>
                  {taxis.map((taxi) => (
                    <option key={taxi.id} value={taxi.id}>
                      {taxi.license_plate}
                    </option>
                  ))}
                </select>
                {errors.taxi_id && <p className="text-red-500 text-sm mt-1">{errors.taxi_id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={createData.phone}
                  onChange={(e) => setCreateData('phone', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">Email</label>
                <input
                  name="email"
                  value={createData.email}
                  onChange={(e) => setCreateData('email', e.target.value)}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
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
                {processing ? 'Creating...' : 'Create Driver'}
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

import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';

interface Alert {
  id: number;
  type: string;
  description: string;
  detected_at: string;
}

interface AlertsProps extends PageProps {
  alerts: Alert[];
}

export default function Alerts({ auth, alerts }: AlertsProps) {
  return (
    <AuthenticatedLayout>
      <Head title="Alerts" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Security Alerts</h2>

          <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium tracking-wider uppercase">#</th>
                  <th className="py-3 px-6 text-left text-xs font-medium tracking-wider uppercase">Type</th>
                  <th className="py-3 px-6 text-left text-xs font-medium tracking-wider uppercase">Description</th>
                  <th className="py-3 px-6 text-left text-xs font-medium tracking-wider uppercase">Detected At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <tr key={alert.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-700 font-semibold">{index + 1}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-indigo-600 font-bold uppercase">{alert.type}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-600">{alert.description}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{new Date(alert.detected_at).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500 text-sm">No alerts so far.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-right">
            <a href="/dashboard" className="text-indigo-500 text-sm font-medium hover:underline">← Back to Dashboard</a>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

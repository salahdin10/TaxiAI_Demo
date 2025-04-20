import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  FaHome,
  FaInfoCircle,
  FaPhone,
  FaBars,
  FaBrain,
  FaTimes,
  FaSearch,
  FaBell,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import {
  UserCircle,
  LogOut,
  LayoutDashboard,
  CarTaxiFront,
  Users,
  UserCog,
  Map,
  MapPin,
  ScanFace,
} from 'lucide-react';

function Navbar() {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) setSearchQuery('');
  };

  return (
    <div className="navbar px-4 md:px-6 shadow-lg bg-white dark:bg-gray-800 text-[#1e3a8a] dark:text-white font-sans">
      {/* Left Section */}
      <div className="navbar-start flex items-center space-x-3">
        <Link
          href={user ? '/dashboard' : '/'}
          className="flex items-center space-x-2 text-xl font-bold tracking-tight"
        >
          <span className="text-3xl">🚖</span>
          <span className="font-black text-2xl">
            Taxi<span className="text-[#0e2a6b] dark:text-blue-300">Ai</span>
          </span>
        </Link>

        {!user && (
          <div className="hidden md:flex ml-6 space-x-5">
            <Link href="/" title="Home" className="hover:text-[#0e2a6b] dark:hover:text-blue-300 transition">
              <FaHome className="h-5 w-5" />
            </Link>
            <Link href="/about" title="About" className="hover:text-[#0e2a6b] dark:hover:text-blue-300 transition">
              <FaInfoCircle className="h-5 w-5" />
            </Link>
            <Link href="/contact" title="Contact" className="hover:text-[#0e2a6b] dark:hover:text-blue-300 transition">
              <FaPhone className="h-5 w-5" />
            </Link>
          </div>
        )}

        {user && (
          <>
            {user.usertype === 'user' && (
              <div className="drawer drawer-start">
                <input id="user-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="user-drawer" className="btn btn-ghost btn-circle">
                    <FaBars className="h-6 w-6" />
                  </label>
                </div>
                <div className="drawer-side z-40">
                  <label htmlFor="user-drawer" className="drawer-overlay"></label>
                  <ul className="menu bg-[#0e2a6b] dark:bg-gray-900 text-white min-h-full w-80 p-4 space-y-2">
                    <li className="rounded-lg hover:bg-gray-800 transition-all">
                      <Link href={route('dashboard')} className="flex items-center space-x-2">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>User Page</span>
                      </Link>
                    </li>
                    <li className="rounded-lg hover:bg-gray-800 transition-all">
                    <Link href={route('ai.recognition')} className="flex items-center space-x-2">
                        <ScanFace className="h-5 w-5" />
                        <span>Recognition</span>
                      </Link>
                    </li>
                    <li className="rounded-lg hover:bg-gray-800 transition-all">
                    <Link href={route('alerts.index')} className="flex items-center space-x-2">
                        <FaBell className="h-5 w-5" />
                        <span>Alerts</span>
                      </Link>
                    </li>
                    <li className="rounded-lg hover:bg-gray-800 transition-all">
                      <Link href={route('profile.edit')} className="flex items-center space-x-2">
                        <UserCircle className="h-5 w-5" />
                        <span>Profile</span>
                      </Link>
                    </li>
                    <li className="rounded-lg hover:bg-gray-800 transition-all">
                      <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex items-center space-x-2"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {user.usertype === 'admin' && (
              <div className="drawer drawer-start">
                <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="admin-drawer" className="btn btn-ghost btn-circle">
                    <FaBars className="h-6 w-6" />
                  </label>
                </div>
                <div className="drawer-side z-40">
                  <label htmlFor="admin-drawer" className="drawer-overlay"></label>
                  <ul className="menu bg-[#0e2a6b] dark:bg-gray-900 text-white min-h-full w-80 p-4 space-y-2">
                    {/* Dashboard Section */}
                    <div className="mb-4">
                      <li className="menu-title text-sm font-semibold text-white/70 mb-2">ADMIN DASHBOARD</li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.dashboard')} className="flex items-center space-x-2">
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Dashboard Overview</span>
                        </Link>
                      </li>
                    </div>

                    {/* Transport Management */}
                    <div className="py-2">
                      <li className="menu-title text-sm font-semibold text-white/70 mb-2">TRANSPORT MANAGEMENT</li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.taxis.index')} className="flex items-center space-x-2">
                          <CarTaxiFront className="h-5 w-5" />
                          <span>Taxi Fleet</span>
                        </Link>
                      </li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.drivers.index')} className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Drivers Management</span>
                        </Link>
                      </li>
                    </div>

                    {/* User Management */}
                    <div className="py-2">
                      <li className="menu-title text-sm font-semibold text-white/70 mb-2">USER MANAGEMENT</li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.users')} className="flex items-center space-x-2">
                          <UserCog className="h-5 w-5" />
                          <span>User Accounts</span>
                        </Link>
                      </li>
                    </div>

                    {/* Geographical Management */}
                    <div className="py-2">
                      <li className="menu-title text-sm font-semibold text-white/70 mb-2">GEOGRAPHICAL</li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.regions.index')} className="flex items-center space-x-2">
                          <Map className="h-5 w-5" />
                          <span>Regions</span>
                        </Link>
                      </li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('admin.zones.index')} className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5" />
                          <span>Zones</span>
                        </Link>
                      </li>
                    </div>

                    {/* Account Section */}
                    <div className="pt-4 border-t border-white/10">
                      <li className="menu-title text-sm font-semibold text-white/70 mb-2 mt-4">ACCOUNT</li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all">
                        <Link href={route('profile.edit')} className="flex items-center space-x-2">
                          <UserCircle className="h-5 w-5" />
                          <span>Profile Settings</span>
                        </Link>
                      </li>
                      <li className="rounded-lg hover:bg-gray-800 transition-all text-red-100 hover:text-red-300">
                        <Link
                          href={route('logout')}
                          method="post"
                          as="button"
                          className="flex items-center space-x-2"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </Link>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="navbar-end flex items-center space-x-4">
        {user ? (
          <>
            {showSearch ? (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1 shadow">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent text-[#1e3a8a] dark:text-white placeholder:text-[#1e3a8a]/70 dark:placeholder:text-gray-300 outline-none w-40 md:w-64 px-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={toggleSearch} className="text-gray-500 dark:text-gray-300">
                  <FaTimes />
                </button>
              </div>
            ) : (
              <button
                className="btn btn-ghost btn-circle hover:text-[#0e2a6b] dark:hover:text-blue-300"
                onClick={toggleSearch}
              >
                <FaSearch />
              </button>
            )}

            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-circle hover:text-[#0e2a6b] dark:hover:text-blue-300"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <button
              title="Information"
              className="btn btn-outline btn-sm rounded-full border-[#1e3a8a] dark:border-white text-[#1e3a8a] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() =>
                (document.getElementById('info_modal') as HTMLDialogElement).showModal()
              }
            >
              <FaInfoCircle />
            </button>

            <dialog id="info_modal" className="modal">
              <div className="modal-box p-5 max-w-sm border border-[#1e3a8a] dark:border-gray-600 shadow-lg rounded-lg bg-white dark:bg-gray-800">
                <form method="dialog" className="text-right">
                  <button className="btn btn-xs btn-circle btn-ghost">✕</button>
                </form>
                <div className="text-center">
                  <FaInfoCircle className="h-10 w-10 text-[#1e3a8a] dark:text-blue-300 mb-2" />
                  <h3 className="font-semibold text-lg dark:text-white">Heads Up!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Everything's running smoothly!
                  </p>
                </div>
              </div>
            </dialog>

            <button title="Notifications" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <FaBell />
                <span className="badge badge-xs badge-warning indicator-item"></span>
              </div>
            </button>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-offset-2 ring-[#1e3a8a] dark:ring-white ring-opacity-40">
                  <img
                    alt="User Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white dark:bg-gray-800 text-[#1e3a8a] dark:text-white rounded-box mt-3 w-52 p-2 shadow-md space-y-1"
              >
                <li>
                  <Link href={route('profile.edit')} className="flex items-center">
                    <UserCircle className="mr-2" />
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center"
                  >
                    <LogOut className="mr-2" />
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="btn btn-ghost btn-circle hover:text-[#0e2a6b] dark:hover:text-blue-300"
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            <Link
              href={route('login')}
              className="btn btn-ghost text-[#1e3a8a] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Login
            </Link>
            <Link
              href={route('register')}
              className="btn bg-[#1e3a8a] dark:bg-blue-700 text-white hover:bg-[#0e2a6b] dark:hover:bg-blue-800 shadow-md"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;

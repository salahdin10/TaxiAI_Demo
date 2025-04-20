import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('register'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head title="Register" />

      <div className="w-full max-w-md">
        {/* Animated Logo with Taxi Icon */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 text-xl font-bold hover:text-primary transition duration-300"
          >
            <span
              className="text-3xl animate-bounce"
              style={{
                animationDuration: '2s',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
              }}
            >
              🚖
            </span>
            <span className="tracking-wide text-gray-800 font-black text-2xl">
              Taxi<span className="text-indigo-500">Ai</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Create an Account</h1>
          <p className="text-gray-600">Join the TaxiAi platform</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={submit}>
              {/* Name */}
              <div className="mb-4">
                <InputLabel htmlFor="name" value="Name" />
                <TextInput
                  id="name"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  autoComplete="name"
                  isFocused={true}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                />
                <InputError message={errors.name} className="mt-1 text-sm" />
              </div>

              {/* Email */}
              <div className="mb-4">
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className="mt-1 block w-full"
                  autoComplete="username"
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                <InputError message={errors.email} className="mt-1 text-sm" />
              </div>

              {/* Password */}
              <div className="mb-4">
                <InputLabel htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="mt-1 block w-full"
                  autoComplete="new-password"
                  onChange={(e) => setData('password', e.target.value)}
                  required
                />
                <InputError message={errors.password} className="mt-1 text-sm" />
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                <TextInput
                  id="password_confirmation"
                  type="password"
                  name="password_confirmation"
                  value={data.password_confirmation}
                  className="mt-1 block w-full"
                  autoComplete="new-password"
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  required
                />
                <InputError message={errors.password_confirmation} className="mt-1 text-sm" />
              </div>

              {/* Register button + Link */}
              <div className="mt-6 flex items-center justify-between">
                <Link
                  href={route('login')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Already registered?
                </Link>

                <PrimaryButton className="ms-4" disabled={processing}>
                  {processing ? 'Registering...' : 'Register'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';

import Checkbox from '@/Components/Core/Checkbox';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';

export default function Login({
                                status,
                                canResetPassword,
                              }: {
  status?: string;
  canResetPassword: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false as boolean,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head title="Log in" />

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
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {status && (
              <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
                {status}
              </div>
            )}

            <form onSubmit={submit}>
              {/* Email */}
              <div className="mb-4">
                <InputLabel htmlFor="email" value="Email">
                  <Mail className="mr-2 h-5 w-5 text-gray-600" /> {/* Add the icon */}
                </InputLabel>
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  placeholder="addressemail@gmail.com"
                  className="mt-1 block w-full"
                  autoComplete="username"
                  isFocused={true}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                <InputError message={errors.email} className="mt-1 text-sm" />
              </div>

              {/* Password */}
              <div className="mb-4">
                <InputLabel htmlFor="password" value="Password">
                  <Lock className="mr-2 h-5 w-5 text-gray-600" /> {/* Add the icon */}
                </InputLabel>
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  placeholder="••••••••"
                  className="mt-1 block w-full"
                  autoComplete="current-password"
                  onChange={(e) => setData('password', e.target.value)}
                  required
                />
                <InputError message={errors.password} className="mt-1 text-sm" />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="mb-4 flex items-center justify-between">
                <label className="flex items-center">
                  <Checkbox
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                  />
                  <span className="ms-2 text-sm text-gray-600">Remember me</span>
                </label>

                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>

              {/* Login Button */}
              <div className="mt-6">
                <PrimaryButton className="w-full" disabled={processing}>
                  {processing ? 'Signing in...' : 'Sign in'}
                </PrimaryButton>
              </div>
            </form>

            {/* Signup Link */}
            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link
                href={route('register')}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

import InputError from '@/Components/Core/InputError';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Head title="Forgot Password" />

      <div className="w-full max-w-md">
        {/* Logo & Header */}
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
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Reset Password</h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {status && (
              <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400 text-center">
                {status}
              </div>
            )}

            <form onSubmit={submit}>
              {/* Email */}
              <div className="mb-4">
                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                <InputError message={errors.email} className="mt-2 text-sm" />
              </div>

              {/* Button */}
              <div className="mt-6 flex items-center justify-between">
                <Link
                  href={route('login')}
                  className="text-sm text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Back to login
                </Link>
                <PrimaryButton className="ms-4" disabled={processing}>
                  {processing ? 'Sending...' : 'Send Reset Link'}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

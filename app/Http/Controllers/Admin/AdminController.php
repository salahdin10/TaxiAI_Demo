<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function users(Request $request)
    {
        $query = User::select('id', 'name', 'email', 'created_at');

        if ($search = $request->get('search')) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->latest()->paginate(10);

        return Inertia::render('Admin/Users', ['users' => $users]);
    }

    // Delete user (we've already used this)
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    // Show the edit form for the specified user
    public function edit(User $user)
    {
        // Render an edit page with the user data
        return Inertia::render('Admin/UsersEdit', ['user' => $user]);
    }

    // Update the specified user's data
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $user->update([
            'name'  => $validated['name'],
            'email' => $validated['email'],
            'password' => !empty($validated['password']) ? Hash::make($validated['password']) : $user->password,
        ]);

        return Inertia::render('Admin/Users', [
            'users' => User::select('id', 'name', 'email', 'created_at')->latest()->paginate(10),
        ])->with('success', 'User updated successfully.');
    }

}

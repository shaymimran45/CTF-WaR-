import { supabase } from './supabase';

export class AuthService {
    // Sign up
    static async signUp(email: string, password: string, username: string) {
        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error('User creation failed');

            // Create user profile
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    username,
                    email,
                    created_at: new Date().toISOString(),
                });

            if (profileError) throw profileError;

            return { success: true, user: authData.user };
        } catch (error: any) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in
    static async signIn(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            return { success: true, user: data.user };
        } catch (error: any) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    // Get current user
    static async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // Get user profile
    static async getUserProfile(userId: string) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Get user profile error:', error);
            return null;
        }
    }

    // Check if username exists
    static async checkUsernameExists(username: string): Promise<boolean> {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('username')
                .eq('username', username)
                .single();

            return !!data;
        } catch (error) {
            return false;
        }
    }
}

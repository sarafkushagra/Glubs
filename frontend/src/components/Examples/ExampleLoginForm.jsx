/**
 * Example Login Form Component
 * Demonstrates best practices with new infrastructure
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Input, Button, Card, Alert } from '../UI';
import { useAuth } from '../../context/AppProvider';
import { authService } from '../../services/api.service';
import { validators, handleApiError, formatters } from '../../utils/helpers';

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Client-side validation
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit to server
    setLoading(true);
    try {
      const response = await authService.signin({
        email: formData.email,
        password: formData.password,
      });

      // Save auth data
      setAuth({
        user: response.data.data.user,
        token: response.data.token,
      });

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const message = handleApiError(error);
      setApiError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {apiError && (
          <Alert
            type="error"
            message={apiError}
            onClose={() => setApiError('')}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            errorMessage={errors.email}
            placeholder="Enter your email"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            errorMessage={errors.password}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-primary-600 dark:text-primary-400 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </Card>
  );
};

export default LoginForm;

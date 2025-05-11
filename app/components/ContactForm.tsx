// app/components/ContactForm.tsx
'use client';
import React, { useState, FormEvent, ChangeEvent } from 'react';
// You can import icons from react-icons if you want to add them next to input fields
// import { FaUser, FaEnvelope, FaPhone, FaPencilAlt } from 'react-icons/fa';

interface ContactFormData {
  name: string;
  email: string;
  phone: string; // Keep as string, backend can handle empty if optional
  message: string;
  // 'privacy-policy' is handled by 'required' on the checkbox,
  // but not typically sent to the backend unless you specifically want to record consent time.
}

const initialFormState: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

const ContactForm: React.FC = () => {
  const [form, setForm] = useState<ContactFormData>(initialFormState);
  const [status, setStatus] = useState(''); // For success/error messages
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setStatus('Sending your message...');

    // Prepare data for submission (excluding privacy-policy if not needed in DB)
    const submissionData = {
        name: form.name,
        email: form.email,
        phone: form.phone, // Send even if empty, API route handles it
        message: form.message,
    };

    try {
      const res = await fetch('/api/contact', { // API route we created
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus(data.message || 'Thank you! Your message has been sent.');
        setForm(initialFormState); // Reset form fields
        // If you have a specific checkbox element to reset (not just the 'required' attribute):
        // const privacyCheckbox = event.currentTarget.elements.namedItem('privacy-policy') as HTMLInputElement;
        // if (privacyCheckbox) privacyCheckbox.checked = false;
      } else {
        const errorMessage = data.details
          ? typeof data.details === 'object' ? Object.values(data.details).join(', ') : data.details
          : data.error || 'Sorry, something went wrong. Please try again.';
        setStatus(errorMessage);
        console.error("Contact form submission error from server:", data);
      }
    } catch (error) {
      const err = error as Error;
      console.error("Contact form submission client-side error:", err);
      setStatus(`An unexpected error occurred: ${err.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
            LOCATIONS, CONTACT
            <br />
            & OPENING HOURS
          </h1>
          <p className="mt-4 text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Silverclip Concept store is located in Starboard way Royal Wharf and its easy to reach by car, docklands light railway or thames clipper boat services from central London. On street parking is available at charge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
            {/* Left Column: Inputs */}
            <div className="space-y-5">
              <div>
                <input
                  type="text"
                  name="name" // Corresponds to ContactFormData and API
                  id="name"
                  autoComplete="name"
                  required
                  placeholder="Name*"
                  value={form.name} // Controlled component
                  onChange={handleChange} // Handle changes
                  disabled={isLoading} // Disable while submitting
                  className="block w-full py-2.5 px-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone" // Corresponds to ContactFormData and API
                  id="phone"
                  autoComplete="tel"
                  placeholder="Phone (Optional)"
                  value={form.phone} // Controlled component
                  onChange={handleChange} // Handle changes
                  disabled={isLoading}
                  className="block w-full py-2.5 px-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-100"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email" // Corresponds to ContactFormData and API
                  id="email"
                  autoComplete="email"
                  required
                  placeholder="Email Address*"
                  value={form.email} // Controlled component
                  onChange={handleChange} // Handle changes
                  disabled={isLoading}
                  className="block w-full py-2.5 px-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Right Column: Textarea */}
            <div className="mt-5 md:mt-0">
              <textarea
                id="message"
                name="message" // Corresponds to ContactFormData and API
                rows={9}
                required
                placeholder="How can we help you?*"
                value={form.message} // Controlled component
                onChange={handleChange} // Handle changes
                disabled={isLoading}
                className="block w-full py-2.5 px-4 text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none disabled:bg-gray-100"
              ></textarea>
            </div>
          </div>

          {/* Privacy Policy Checkbox */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center">
              <input
                id="privacy-policy"
                name="privacy-policy" // This name isn't part of ContactFormData for backend
                type="checkbox"
                required // Browser validation for the checkbox
                disabled={isLoading}
                className="h-4 w-4 text-pink-600 border-gray-400 rounded focus:ring-pink-500"
              />
              <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-700">
                I have read and accept the{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-medium text-pink-600 underline hover:text-pink-500">
                  Privacy Policy
                </a>.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="py-3 px-10 border border-transparent rounded-md text-base font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                 <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                 </>
              ) : (
                'GET IN TOUCH'
              )}
            </button>
          </div>
        </form>

        {/* Status Message Display */}
        {status && (
          <p className={`mt-6 p-3 rounded-md text-sm text-center ${
              status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') || status.toLowerCase().includes('wrong')
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
            aria-live="polite" // Good for accessibility
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
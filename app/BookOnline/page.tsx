// app/BookOnline/page.tsx
'use client';
import { useState, FormEvent, ChangeEvent } from 'react'; // Removed unused useEffect
import Navbar from '../components/Navbar';
import FooterSection from '../components/FooterSection';

import {
  FaUserAlt as UserIcon,
  FaEnvelope as EmailIcon,
  FaCalendarAlt as CalendarIcon,
  FaRegCommentDots as MessageIcon,
  FaPaperPlane as SendIcon,
  FaLock as LockIcon
} from 'react-icons/fa';

import {
  loadStripe,
  StripeElementsOptions,
  StripeError,
  PaymentIntent,
} from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error("CRITICAL: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe Elements will not load.");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FormData {
  name: string;
  email: string;
  date: string;
  message: string;
}
const initialFormState: FormData = { name: '', email: '', date: '', message: '' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CheckoutForm = ({ clientSecret, bookingDetails }: { clientSecret: string, bookingDetails: FormData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentStatus, setPaymentStatus] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePaymentSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      setPaymentStatus("Stripe.js hasn't loaded yet. Please wait.");
      return;
    }
    setIsProcessingPayment(true);
    setPaymentStatus('Processing payment...');

    type ConfirmPaymentResult = {
      paymentIntent?: PaymentIntent;
      error?: StripeError;
    };

    const result: ConfirmPaymentResult = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking-confirmation`,
        receipt_email: bookingDetails.email,
      },
    });

    const { error, paymentIntent } = result;

    if (error) {
      console.error("Stripe payment error:", error.type, error.message);
      setPaymentStatus(error.message || 'Payment failed. Please try again or contact support.');
      setIsProcessingPayment(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log("Payment succeeded on client:", paymentIntent);
      setPaymentStatus(`Payment successful! Your booking for ${bookingDetails.name} is confirmed. You will receive an email shortly.`);
    } else if (paymentIntent) {
      console.log("Payment status on client:", paymentIntent.status);
      setPaymentStatus(`Payment status: ${paymentIntent.status}. Please follow any instructions.`);
      if (paymentIntent.status !== 'succeeded') {
          setIsProcessingPayment(false);
      }
    } else {
      console.error("Stripe confirmPayment returned no error and no paymentIntent.");
      setPaymentStatus('An unexpected issue occurred with the payment confirmation.');
      setIsProcessingPayment(false);
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="space-y-7 mt-8">
      <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
      <button
        disabled={isProcessingPayment || !stripe || !elements}
        className="w-full group relative flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl"
      >
        {isProcessingPayment ? (
          <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Processing... </>
        ) : (
          <> <span className="absolute left-0 inset-y-0 flex items-center pl-4"> <LockIcon className="w-5 h-5 text-white opacity-75 group-hover:opacity-100" /> </span> Pay & Confirm Booking ($50.00) </>
        )}
      </button>
      {paymentStatus && !paymentStatus.toLowerCase().includes("payment successful!") && (
        <p className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${paymentStatus.toLowerCase().includes('fail') || paymentStatus.toLowerCase().includes('error') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
          {paymentStatus}
        </p>
      )}
    </form>
  );
};

export default function BookOnlinePage() {
  const [form, setForm] = useState<FormData>(initialFormState);
  const [status, setStatus] = useState('');
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDetailsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        setStatus("Payment gateway configuration error. Please contact support.");
        console.error("Stripe publishable key is not set on client.");
        return;
    }
    setIsLoadingDetails(true);
    setStatus('Preparing your booking...');
    setClientSecret(null);

    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStatus('Please complete your payment below to confirm your booking.');
      } else {
        console.error("Failed to create payment intent:", data.error, data.details);
        setStatus(data.error || 'Failed to initialize payment. Please check details and try again.');
      }
    } catch (error) {
        console.error("Error calling create-payment-intent:", error);
        let errorMessage = 'An unexpected error occurred. Please try again later.';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        setStatus(errorMessage);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const inputBaseClasses = "w-full py-3 rounded-lg border bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-200 ease-in-out shadow-sm";
  const inputWithIconClasses = `${inputBaseClasses} pl-12 pr-4`;
  const inputNormalClasses = `border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-pink-500 focus:border-pink-500`;
  const inputDisabledClasses = `border-slate-200 bg-slate-100 cursor-not-allowed`;

  const appearance: StripeElementsOptions['appearance'] = {
    theme: 'stripe',
    variables: { colorPrimary: '#ec4899', borderRadius: '8px' },
  };
  const options: StripeElementsOptions | undefined = clientSecret ? { clientSecret, appearance } : undefined;

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-10 md:p-14 space-y-8 border-t-4 border-pink-500 hover:shadow-3xl hover:-translate-y-1 transform transition-all duration-300 ease-out">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-700">Book Your Appointment</h1>
            <p className="mt-4 text-center text-slate-600 text-sm md:text-base">Secure your spot with us. We look forward to pampering you!</p>
          </div>

          {!clientSecret ? (
            <form onSubmit={handleDetailsSubmit} className="space-y-7">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <div className="absolute inset-y-0 left-0 top-7 pl-4 flex items-center pointer-events-none">
                  <UserIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input type="text" name="name" id="name" required placeholder="e.g., Jane Doe" value={form.name} onChange={handleChange} className={`${inputWithIconClasses} ${isLoadingDetails ? inputDisabledClasses : inputNormalClasses}`} disabled={isLoadingDetails}/>
              </div>
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="absolute inset-y-0 left-0 top-7 pl-4 flex items-center pointer-events-none">
                  <EmailIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input type="email" name="email" id="email" required placeholder="e.g., jane.doe@example.com" value={form.email} onChange={handleChange} className={`${inputWithIconClasses} ${isLoadingDetails ? inputDisabledClasses : inputNormalClasses}`} disabled={isLoadingDetails}/>
              </div>
              <div className="relative">
                <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-2">Preferred Date</label>
                <div className="absolute inset-y-0 left-0 top-7 pl-4 flex items-center pointer-events-none">
                  <CalendarIcon className="w-5 h-5 text-slate-400" />
                </div>
                <input type="date" name="date" id="date" required value={form.date} onChange={handleChange} className={`${inputWithIconClasses} ${isLoadingDetails ? inputDisabledClasses : inputNormalClasses}`} disabled={isLoadingDetails} min={new Date().toISOString().split("T")[0]}/>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                  <MessageIcon className="w-5 h-5 text-slate-400 inline mr-1.5 align-text-bottom" />
                  Message <span className="text-slate-500 font-normal">(Optional)</span>
                </label>
                <textarea name="message" id="message" rows={4} placeholder="Any specific services, requests, or notes?" value={form.message} onChange={handleChange} className={`${inputBaseClasses} px-4 ${isLoadingDetails ? inputDisabledClasses : inputNormalClasses}`} disabled={isLoadingDetails}></textarea>
              </div>
              <div>
                <button type="submit" disabled={isLoadingDetails} className="w-full group relative flex items-center justify-center py-3.5 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl">
                  {isLoadingDetails ? (
                    <> <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg> Proceeding... </>
                  ) : (
                    <> <span className="absolute left-0 inset-y-0 flex items-center pl-4"> <SendIcon className="w-5 h-5 text-white opacity-75 group-hover:opacity-100" /> </span> Proceed to Payment </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            options && <Elements stripe={stripePromise} options={options}>
              <CheckoutForm clientSecret={clientSecret!} bookingDetails={form} /> {/* Added non-null assertion for clientSecret here as it's checked before rendering Elements */}
            </Elements>
          )}
          {status && (
            <p className={`mt-8 p-4 rounded-lg text-sm font-medium text-center transition-opacity duration-300 ease-in-out ${ status.toLowerCase().includes('fail') || status.toLowerCase().includes('error') ? 'bg-red-50 text-red-700 border border-red-200' : (clientSecret && status.includes('Please complete your payment')) ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-green-50 text-green-700 border border-green-200' }`} aria-live="polite" > {status} </p>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
}
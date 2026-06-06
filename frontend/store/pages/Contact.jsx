import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            📬 We're here to help
          </span>
          <h1 className="text-4xl font-black tracking-tight">Contact Us</h1>
          <p className="text-base-content/60 text-sm leading-relaxed">
            Have a question, suggestion, or issue? Don't hesitate to reach out — our support team will be happy to assist you as quickly as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-5 bg-base-200/50 backdrop-blur-md p-8 rounded-3xl border border-base-300 space-y-8">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="text-base-content/70 text-sm">You can reach us directly through any of the following channels:</p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shrink-0">📍</div>
                <div>
                  <h4 className="font-bold text-sm">Address</h4>
                  <p className="text-xs text-base-content/60">Yemen, Taiz, Jamal Street</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shrink-0">✉️</div>
                <div>
                  <h4 className="font-bold text-sm">Email</h4>
                  <p className="text-xs text-base-content/60">lamiaalariqi123@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl shrink-0">📞</div>
                <div>
                  <h4 className="font-bold text-sm">Phone</h4>
                  <p className="text-xs text-base-content/60">+967-777-777-777</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-base-300">
              <h4 className="font-bold text-sm mb-4">Working Hours</h4>
              <p className="text-xs text-base-content/60 leading-relaxed">
                Saturday to Thursday: 9:00 AM – 9:00 PM <br />
                Friday: Closed
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 bg-base-100 p-8 rounded-3xl border border-base-200 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-base-content/70 mb-1">Full Name <span className="text-rose-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" className="input input-bordered w-full rounded-2xl focus:border-indigo-600 bg-base-200/35" required />
                </div>
                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-base-content/70 mb-1">Email Address <span className="text-rose-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className="input input-bordered w-full rounded-2xl focus:border-indigo-600 bg-base-200/35" required />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label text-xs font-bold text-base-content/70 mb-1">Subject</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Message subject" className="input input-bordered w-full rounded-2xl focus:border-indigo-600 bg-base-200/35" />
              </div>

              <div className="form-control w-full">
                <label className="label text-xs font-bold text-base-content/70 mb-1">Message <span className="text-rose-500">*</span></label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows="5" placeholder="Write your message here..." className="textarea textarea-bordered w-full rounded-2xl focus:border-indigo-600 bg-base-200/35 h-32" required></textarea>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full bg-indigo-600 hover:bg-indigo-500 border-none rounded-2xl text-white font-bold transition-all shadow-md shadow-indigo-500/10 h-12">
                {loading ? <span className="loading loading-spinner loading-md"></span> : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

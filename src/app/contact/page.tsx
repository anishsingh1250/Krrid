
"use client";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-heading font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>
              <div>
                <label className="block mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-lg h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button type="submit" className="bg-primary text-white rounded-lg px-6 py-2 font-heading">
                Send Message
              </button>
            </form>
          </div>
          
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Have questions about our programs? We're here to help!
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">support@krrid.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 Chess Street, Game City, CH 12345</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

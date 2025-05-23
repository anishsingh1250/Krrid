
"use client";
import Link from "next/link";

export default function PlansPage() {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: ["Basic chess lessons", "Limited puzzles", "Community forum access"]
    },
    {
      name: "Premium",
      price: "$9.99/month",
      features: ["Advanced lessons", "Unlimited puzzles", "1-on-1 coaching", "Progress tracking"]
    },
    {
      name: "Elite",
      price: "$19.99/month",
      features: ["Master classes", "Personal mentor", "Tournament preparation", "Analysis tools"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-heading font-bold text-center mb-12">Choose Your Plan</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div key={index} className="border rounded-xl p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-2xl font-heading font-semibold mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="text-primary mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-primary text-white rounded-lg px-4 py-2 font-heading">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

import React from 'react';
import MainLayout from '@/components/Layouts/MainLayout';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Community',
    price: 'Free',
    description: 'For small community organizations',
    features: [
      'Basic incident management',
      'Up to 10 team members',
      'Community alerts',
      'Basic reporting',
      'Email support'
    ]
  },
  {
    name: 'Professional',
    price: '$99',
    period: 'per month',
    description: 'For medium-sized organizations',
    features: [
      'Advanced incident management',
      'Up to 50 team members',
      'Resource optimization',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited incident management',
      'Unlimited team members',
      'Custom features',
      'Dedicated support',
      'SLA guarantees',
      'On-premise deployment',
      'Training & onboarding',
      'Custom reporting'
    ]
  }
];

const PricingPage = () => {
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Transparent Pricing</h1>
          <p className="text-xl text-dark-muted max-w-3xl mx-auto">
            Choose the plan that best fits your organization's needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-dark-secondary rounded-lg p-8 relative ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-lg rounded-tr-lg">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-dark-muted ml-2">{plan.period}</span>
                )}
              </div>
              <p className="text-dark-muted mb-6">{plan.description}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="/api/auth/login"
                className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition"
              >
                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default PricingPage; 
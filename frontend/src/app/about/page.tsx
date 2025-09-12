"use client";

import AuthWrapper from "@/components/AuthWrapper";

export default function AboutPage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background_pattern.png')" }}>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">About TrueBalance</h1>
            <div className="w-24 h-2 bg-blue-600 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Taking control of your finances with ease and clarity
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                TrueBalance helps you take control of your finances with ease and clarity.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                You can securely enter your purchases, recurring bills, and sources of income which are all stored in a reliable database. We track your financial activity in real time, giving you clear insights into your spending, saving, and overall financial health.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-8">
                With statistics and visual reports, you&apos;ll always know where your money is going and how to plan ahead. Whether it&apos;s budgeting for the month, managing recurring expenses, or analyzing your income trends, our goal is to make personal finance simple, transparent, and actionable.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  Why use TrueBalance instead of a traditional checkbook?
                </h2>
                <p className="text-gray-700 mb-4">
                  Lots of people still use physical checkbooks to track their spending. True Balance improves on this through:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Automatic total calculation</li>
                  <li>Useful insights about how you spend and earn money</li>
                  <li>Reliable and secure storage of data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Our Team</h2>
            <p className="text-gray-600 text-center mb-10">The passionate developers behind TrueBalance</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Braeden */}
              <div className="text-center">
                {/* eventually replace this with a picture of us */}
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  B
                </div>
                <h3 className="font-semibold text-gray-900">Braeden Treutel</h3>
                <p className="text-gray-600">FullStack Developer</p>
              </div>
              
              {/* Marco */}
              {/* <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
                <h3 className="font-semibold text-gray-900">Marco Osorio</h3>
                <p className="text-gray-600">Frontend Developer</p>
              </div> */}
              
              {/* Eliab */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  E
                </div>
                <h3 className="font-semibold text-gray-900">Eliab Woldegebriel</h3>
                 <p className="text-gray-600">FullStack Developer</p>
              </div>
              
              {/* Mario */}
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  M
                </div>
                <h3 className="font-semibold text-gray-900">Mario Missiha</h3>
                 <p className="text-gray-600">FullStack Developer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
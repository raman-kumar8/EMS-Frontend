import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching your existing design */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About TaskMate</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Empowering teams to achieve more through intelligent task management
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At TaskMate, we believe that great things happen when teams work together seamlessly. 
            Our mission is to provide intuitive, powerful tools that help individuals and teams 
            organize, prioritize, and accomplish their goals with ease and efficiency.
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Focus</h3>
            <p className="text-gray-600">
              We help you stay focused on what matters most, eliminating distractions and streamlining workflows.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Collaboration</h3>
            <p className="text-gray-600">
              Built for teams, our platform makes it easy to share tasks, track progress, and work together.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h3>
            <p className="text-gray-600">
              We're committed to delivering a superior user experience through continuous innovation and improvement.
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Passion</h3>
            <p className="text-gray-600">
              We're passionate about productivity and genuinely care about helping our users succeed.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Story</h2>
          <div className="prose max-w-none text-gray-600">
            <p className="text-lg leading-relaxed mb-4">
              TaskMate was born from a simple observation: too many great ideas and important tasks 
              get lost in the chaos of daily work life. Our founders, experienced in both technology 
              and project management, recognized the need for a tool that could bridge the gap between 
              simple to-do lists and complex project management software.
            </p>
            <p className="text-lg leading-relaxed mb-4">
              What started as a side project to solve our own productivity challenges has grown into 
              a comprehensive platform trusted by thousands of users worldwide. We've maintained our 
              focus on simplicity without sacrificing power, ensuring that TaskMate remains accessible 
              to individuals while scaling to meet the needs of large teams.
            </p>
            <p className="text-lg leading-relaxed">
              Today, TaskMate continues to evolve based on user feedback and emerging workplace trends. 
              We're committed to staying at the forefront of productivity technology while never losing 
              sight of our core mission: making work more organized, efficient, and enjoyable.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose TaskMate?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Intuitive Design</h3>
              <p className="text-gray-600">
                Clean, modern interface that's easy to learn and a pleasure to use every day.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Powerful Features</h3>
              <p className="text-gray-600">
                Everything you need to manage tasks, track progress, and collaborate effectively.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Reliable Support</h3>
              <p className="text-gray-600">
                Dedicated customer support team ready to help you succeed with TaskMate.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 text-lg">
            Join thousands of users who have transformed their productivity with TaskMate.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
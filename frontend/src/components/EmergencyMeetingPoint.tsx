import React from 'react';
import { ArrowLeft, MapPin, Clock, Users, Phone, AlertTriangle } from 'lucide-react';

interface EmergencyMeetingPointProps {
  onBack: () => void;
}

const EmergencyMeetingPoint: React.FC<EmergencyMeetingPointProps> = ({ onBack }) => {
  const meetingPoints = [
    {
      name: "Central Library Entrance",
      address: "123 University Ave, Campus Center",
      coordinates: "40.7128° N, 74.0060° W",
      capacity: "500 people",
      facilities: ["Water Station", "First Aid Kit", "Charging Stations", "Restrooms"],
      emergencyContacts: ["Campus Security: (555) 123-4567", "Emergency Services: 911"]
    },
    {
      name: "Student Union Plaza",
      address: "456 College Blvd, Student Center",
      coordinates: "40.7589° N, 73.9851° W",
      capacity: "800 people",
      facilities: ["Medical Tent", "Communication Center", "Food Distribution", "Rest Areas"],
      emergencyContacts: ["Student Services: (555) 987-6543", "Emergency Services: 911"]
    },
    {
      name: "Sports Complex Parking Lot",
      address: "789 Athletic Dr, Sports Center",
      coordinates: "40.7505° N, 73.9934° W",
      capacity: "1000 people",
      facilities: ["Emergency Vehicles Access", "Helicopter Landing Zone", "Mass Communication System"],
      emergencyContacts: ["Athletic Department: (555) 456-7890", "Emergency Services: 911"]
    }
  ];

  return (
    <div className="min-h-screen modern-gradient">
      {/* Header */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-3 premium-button px-6 py-3 hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-12 h-12 text-red-500 mr-4 animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Family Emergency Meeting Point
              </h1>
              <AlertTriangle className="w-12 h-12 text-red-500 ml-4 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              In case of emergency, these designated meeting points ensure families can reunite safely and efficiently.
              Memorize these locations and share them with your loved ones.
            </p>
            <div className="flex items-center justify-center gap-4 text-lg font-semibold text-red-600 dark:text-red-400">
              <Phone className="w-6 h-6" />
              <span>Emergency Hotline: (555) 911-0000</span>
            </div>
          </div>

          {/* Meeting Points Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
            {meetingPoints.map((point, index) => (
              <div
                key={index}
                className="premium-card hover:scale-105 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {point.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {point.address}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {point.coordinates}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Capacity: {point.capacity}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-500" />
                      Available Facilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {point.facilities.map((facility, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-500" />
                      Emergency Contacts
                    </h4>
                    <div className="space-y-1">
                      {point.emergencyContacts.map((contact, idx) => (
                        <p key={idx} className="text-sm text-gray-600 dark:text-gray-300">
                          {contact}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Instructions */}
          <div className="premium-card p-8 mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Emergency Response Instructions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Stay Calm</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Remain calm and follow instructions from emergency personnel
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Head to Meeting Point</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Proceed to the nearest designated meeting point immediately
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Register Your Presence</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Check in with emergency coordinators at the meeting point
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Wait for Family</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Stay at the meeting point until all family members are accounted for
                </p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-4">
                  ⚠️ Important Safety Notice
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• These meeting points are activated only during actual emergencies</li>
                  <li>• Follow all instructions from emergency personnel and campus security</li>
                  <li>• Do not use these locations for non-emergency purposes</li>
                  <li>• Keep emergency contact information readily accessible</li>
                  <li>• Regularly review and update your family's emergency plan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyMeetingPoint;

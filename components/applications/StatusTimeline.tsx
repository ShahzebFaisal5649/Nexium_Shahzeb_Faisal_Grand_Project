import React from 'react';

interface TimelineEvent {
  id: string;
  date: string;
  status: string;
  description: string;
  type: 'applied' | 'screening' | 'interview' | 'offer' | 'rejection' | 'acceptance';
}

interface StatusTimelineProps {
  className?: string;
  events?: TimelineEvent[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ className, events }) => {
  const defaultEvents: TimelineEvent[] = [
    {
      id: '1',
      date: '2024-01-15',
      status: 'Application Submitted',
      description: 'Successfully submitted application through company portal',
      type: 'applied'
    },
    {
      id: '2',
      date: '2024-01-18',
      status: 'Phone Screening',
      description: 'Initial phone screening with HR representative',
      type: 'screening'
    },
    {
      id: '3',
      date: '2024-01-22',
      status: 'Technical Interview',
      description: 'Technical interview with senior developer',
      type: 'interview'
    },
    {
      id: '4',
      date: '2024-01-25',
      status: 'Final Interview',
      description: 'Final interview with hiring manager',
      type: 'interview'
    }
  ];

  const timelineEvents = events || defaultEvents;

  const getStatusColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'applied': return 'bg-blue-500';
      case 'screening': return 'bg-yellow-500';
      case 'interview': return 'bg-purple-500';
      case 'offer': return 'bg-green-500';
      case 'rejection': return 'bg-red-500';
      case 'acceptance': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Application Timeline</h2>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {timelineEvents.map((event) => (
          <div key={event.id} className="relative flex items-start mb-8 last:mb-0">
            {/* Timeline dot */}
            <div className={`absolute left-0 w-8 h-8 ${getStatusColor(event.type)} rounded-full flex items-center justify-center`}>
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="ml-12 bg-gray-50 rounded-lg p-4 w-full">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{event.status}</h3>
                <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
        <p className="text-blue-600 text-sm">
          Waiting for feedback from the final interview. Expected response within 3-5 business days.
        </p>
      </div>
    </div>
  );
};

export default StatusTimeline;
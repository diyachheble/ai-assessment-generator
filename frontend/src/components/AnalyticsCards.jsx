export const AnalyticsCards = ({ analytics }) => {
  const cards = [
    {
      label: 'Total Assessments Generated',
      value: analytics.totalAssessments,
      icon: '📊',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Tests Attempted',
      value: analytics.totalTestsAttempted,
      icon: '✅',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Average Score (%)',
      value: analytics.averageScore,
      icon: '⭐',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Success Rate (%)',
      value: analytics.successRate,
      icon: '🎯',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.bgColor} rounded-lg p-6 shadow-sm border border-gray-100`}>
          <div className="text-4xl mb-4">{card.icon}</div>
          <p className="text-gray-600 text-sm mb-2">{card.label}</p>
          <p className="text-3xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

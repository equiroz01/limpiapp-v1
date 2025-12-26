import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../../services/dashboard.service';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardService.getStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando estadísticas...</div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Clientes',
      value: stats?.totalClients || 0,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Total Profesionales',
      value: stats?.totalHousekeepers || 0,
      icon: '🧹',
      color: 'bg-green-500',
    },
    {
      title: 'Total Reservas',
      value: stats?.totalBookings || 0,
      icon: '📅',
      color: 'bg-purple-500',
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: '💰',
      color: 'bg-yellow-500',
    },
    {
      title: 'Reservas Activas',
      value: stats?.activeBookings || 0,
      icon: '🔄',
      color: 'bg-indigo-500',
    },
    {
      title: 'Verificaciones Pendientes',
      value: stats?.pendingVerifications || 0,
      icon: '⏳',
      color: 'bg-orange-500',
    },
    {
      title: 'Disputas Abiertas',
      value: stats?.openDisputes || 0,
      icon: '⚠️',
      color: 'bg-red-500',
    },
    {
      title: 'Nuevos Usuarios (Mes)',
      value: stats?.newUsersThisMonth || 0,
      icon: '🆕',
      color: 'bg-teal-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general de la plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <p className="text-gray-500 text-center py-8">
              Próximamente: Lista de actividades recientes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Ingresos del Mes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ingresos Totales</span>
              <span className="text-2xl font-bold text-green-600">
                ${stats?.revenueThisMonth?.toFixed(2) || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Reservas del Mes</span>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.bookingsThisMonth || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

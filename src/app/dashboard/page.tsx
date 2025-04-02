import RoleBasedComponent from '@/components/RoleBasedComponent'

export default function DashboardPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Contenu visible par tous les utilisateurs authentifiés */}
      <div className="mb-8">
        <h2 className="text-xl mb-2">Informations générales</h2>
        <p>Cette section est visible par tous les utilisateurs connectés.</p>
      </div>

      {/* Section réservée aux administrateurs */}
      <RoleBasedComponent requiredRole="admin">
        <div className="bg-blue-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl mb-2">Administration</h2>
          <p>Cette section n'est visible que par les administrateurs.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Gérer les utilisateurs
          </button>
        </div>
      </RoleBasedComponent>

      {/* Section réservée aux modérateurs */}
      <RoleBasedComponent requiredRole="moderator">
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl mb-2">Modération</h2>
          <p>Cette section n'est visible que par les modérateurs.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Modérer les paris
          </button>
        </div>
      </RoleBasedComponent>

      {/* Section réservée aux utilisateurs premium */}
      <RoleBasedComponent requiredRole="premium_user">
        <div className="bg-purple-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl mb-2">Fonctionnalités Premium</h2>
          <p>Cette section n'est visible que par les utilisateurs premium.</p>
          <button className="bg-purple-500 text-white px-4 py-2 rounded mt-2">
            Accéder aux cotes premium
          </button>
        </div>
      </RoleBasedComponent>

      {/* Vérification basée sur les permissions */}
      <RoleBasedComponent requiredPermission="manage_transactions">
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl mb-2">Gestion des transactions</h2>
          <p>Cette section n'est visible que par les utilisateurs ayant la permission de gérer les transactions.</p>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded mt-2">
            Voir les transactions
          </button>
        </div>
      </RoleBasedComponent>
    </div>
  )
} 
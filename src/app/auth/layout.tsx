import { Calendar } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="flex items-center mb-8">
            <Calendar className="h-12 w-12 text-white" />
            <span className="ml-3 text-3xl font-bold text-white">
              RendezVous
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Simplifiez la gestion de vos rendez-vous
          </h1>
          <p className="text-xl text-primary-100 mb-8">
            Créez vos liens de réservation, partagez-les avec vos clients,
            et laissez-les choisir leurs créneaux préférés.
          </p>
          <div className="space-y-4 text-primary-100">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>Calendrier intuitif et facile à utiliser</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>Réservations automatiques 24h/24</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-300 rounded-full mr-3"></div>
              <span>Notifications et rappels automatiques</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Calendar className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-secondary-900">
              RendezVous
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
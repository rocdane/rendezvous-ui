import Link from 'next/link';
import { Button } from '@/components/ui';
import { Calendar, Clock, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Header */}
      <header className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-secondary-900">
                {process.env.NEXT_PUBLIC_APP_NAME || 'RendezVous'}
              </span>
            </div>
            <nav className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-secondary-600 hover:text-secondary-900 font-medium"
              >
                Connexion
              </Link>
              <Link href="/auth/register">
                <Button>Commencer gratuitement</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6">
              Simplifiez vos
              <span className="text-primary-600 block">rendez-vous</span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Créez vos liens de réservation personnalisés, partagez-les avec vos clients,
              et laissez-les choisir leurs créneaux. Fini les allers-retours d&apos;emails !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Commencer gratuitement
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                Voir une démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Des fonctionnalités puissantes pour gérer vos rendez-vous en toute simplicité
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Calendrier intuitif
              </h3>
              <p className="text-secondary-600">
                Interface claire pour visualiser et gérer tous vos rendez-vous
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Réservation automatique
              </h3>
              <p className="text-secondary-600">
                Vos clients réservent directement selon vos disponibilités
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Gestion des clients
              </h3>
              <p className="text-secondary-600">
                Notifications automatiques et historique des rendez-vous
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Intégrations
              </h3>
              <p className="text-secondary-600">
                Synchronisation avec Google Calendar, Outlook et Zoom
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à simplifier vos rendez-vous ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers de professionnels qui ont déjà adopté RendezVous
          </p>
          <Link href="/auth/register">
            <Button
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg bg-white text-primary-600 hover:bg-primary-50"
            >
              Créer mon compte gratuit
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold text-white">
                {process.env.NEXT_PUBLIC_APP_NAME || 'RendezVous'}
              </span>
            </div>
            <div className="text-secondary-400 text-sm">
              © 2024 {process.env.NEXT_PUBLIC_COMPANY_NAME || 'VotreEntreprise'}. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
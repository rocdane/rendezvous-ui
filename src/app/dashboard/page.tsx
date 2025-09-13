'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/stores/auth';
import { eventService, bookingService } from '@/services';
import { Button, Card, Badge } from '@/components/ui';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  TrendingUp,
  ArrowRight,
  Copy,
  ExternalLink,
  Settings,
  BarChart3,
  Share2,
  Globe
} from 'lucide-react';
import { Event, Booking } from '@/types';
import { toast } from 'sonner';

// Define PaginatedResponse type if not imported from elsewhere
type PaginatedResponse<T> = {
  data: T[];
  total: number;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventsData, setEventsData] = useState<PaginatedResponse<Event>>({ data: [], total: 0 });
  const [bookingsData, setBookingsData] = useState<PaginatedResponse<Booking>>({ data: [], total: 0 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les événements
      const eventsResponse = await eventService.getEvents(1);
      const userEvents = eventsResponse.data || [];
      setEvents(userEvents.slice(0, 5)); // Derniers 5 événements
      setEventsData(eventsResponse);

      // Charger les réservations récentes
      const bookingsResponse = await bookingService.getBookings(1);
      const userBookings = bookingsResponse.data || [];
      setRecentBookings(userBookings.slice(0, 5)); // Dernières 5 réservations
      setBookingsData(bookingsResponse);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Impossible de charger les données du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = useMemo(() => {
    const userEvents = eventsData.data || [];
    const userBookings = bookingsData.data || [];
    
    return {
      totalEvents: eventsData.total || 0,
      totalBookings: bookingsData.total || 0,
      thisWeekBookings: userBookings.filter((booking: Booking) => {
        const bookingDate = new Date(booking.start_time);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return bookingDate >= weekAgo;
      }).length,
      activeEvents: userEvents.filter((event: Event) => event.is_active).length,
    };
  }, [eventsData, bookingsData]);

  const copyShareLink = () => {
    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL}/booking/${user?.slug}`;
    navigator.clipboard.writeText(shareLink);
    toast.success('Lien copié dans le presse-papiers !');
  };

  const openPublicPage = () => {
    const publicLink = `${process.env.NEXT_PUBLIC_APP_URL}/booking/${user?.slug}`;
    window.open(publicLink, '_blank');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-secondary-200 rounded w-96"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <div className="h-20 bg-secondary-200 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <div className="h-64 bg-secondary-200 rounded animate-pulse"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-secondary-900 sm:truncate sm:text-3xl">
            Bonjour {user?.name} ! 👋
          </h2>
          <p className="mt-1 text-sm text-secondary-500">
            Voici un aperçu de votre activité récente
          </p>
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0 space-x-3">
          <Button variant="outline" onClick={openPublicPage}>
            <Globe className="h-4 w-4 mr-2" />
            Page publique
          </Button>
          <Button variant="outline" onClick={copyShareLink}>
            <Copy className="h-4 w-4 mr-2" />
            Copier mon lien
          </Button>
          <Link href={"/dashboard/events/new" as never}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel événement
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-500 truncate">
                  Total événements
                </dt>
                <dd className="text-lg font-medium text-secondary-900">
                  {stats.totalEvents}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-500 truncate">
                  Événements actifs
                </dt>
                <dd className="text-lg font-medium text-secondary-900">
                  {stats.activeEvents}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-500 truncate">
                  Total réservations
                </dt>
                <dd className="text-lg font-medium text-secondary-900">
                  {stats.totalBookings}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-secondary-500 truncate">
                  Cette semaine
                </dt>
                <dd className="text-lg font-medium text-secondary-900">
                  {stats.thisWeekBookings}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Events */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900">
              Mes événements
            </h3>
            <Link href={"/dashboard/events" as never}>
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-secondary-900">
                        {event.title}
                      </h4>
                      <Badge variant={event.is_active ? 'success' : 'default'} size="sm">
                        {event.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      {event.duration} minutes • {event.bookings_count || 0} réservation{(event.bookings_count || 0) > 1 ? 's' : ''}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/events/${event.id}` as never}
                    className="text-primary-600 hover:text-primary-700 p-1 rounded hover:bg-primary-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900">
                Aucun événement
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                Créez votre premier événement pour commencer à recevoir des réservations.
              </p>
              <div className="mt-6">
                <Link href={"/dashboard/events/new" as never}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un événement
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>

        {/* Recent Bookings */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-secondary-900">
              Réservations récentes
            </h3>
            <Link href={"/dashboard/bookings" as never}>
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-secondary-900">
                        {booking.guest_name}
                      </h4>
                      <Badge 
                        variant={
                          booking.status === 'confirmed' ? 'success' :
                          booking.status === 'cancelled' ? 'danger' : 'default'
                        } 
                        size="sm"
                      >
                        {booking.status === 'confirmed' ? 'Confirmé' :
                         booking.status === 'cancelled' ? 'Annulé' :
                         booking.status === 'completed' ? 'Terminé' : booking.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-500 mt-1">
                      {new Date(booking.start_time).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-xs text-secondary-400 max-w-24 truncate">
                    {booking.event?.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-secondary-400" />
              <h3 className="mt-2 text-sm font-medium text-secondary-900">
                Aucune réservation
              </h3>
              <p className="mt-1 text-sm text-secondary-500">
                Vos réservations apparaîtront ici une fois que vous aurez créé des événements.
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-medium text-secondary-900 mb-4">
          Actions rapides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={"/dashboard/events/new" as never}>
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <Plus className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <p className="font-medium text-secondary-900">Nouvel événement</p>
                <p className="text-sm text-secondary-500">Créer un type de rendez-vous</p>
              </div>
            </div>
          </Link>

          <Link href={"/dashboard/availability" as never}>
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <Clock className="h-8 w-8 text-success-600 mr-3" />
              <div>
                <p className="font-medium text-secondary-900">Disponibilités</p>
                <p className="text-sm text-secondary-500">Gérer vos créneaux</p>
              </div>
            </div>
          </Link>

          <button
            onClick={copyShareLink}
            className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-left w-full"
          >
            <Share2 className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-secondary-900">Partager mon lien</p>
              <p className="text-sm text-secondary-500">Copier URL de réservation</p>
            </div>
          </button>

          <Link href={"/dashboard/analytics" as never}>
            <div className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors cursor-pointer">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-secondary-900">Analytiques</p>
                <p className="text-sm text-secondary-500">Voir les statistiques</p>
              </div>
            </div>
          </Link>
        </div>
      </Card>

      {/* Tips Section */}
      {stats.totalEvents === 0 && (
        <Card>
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 rounded-lg border border-primary-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary-100">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-primary-900">
                  Commencez dès maintenant !
                </h3>
                <p className="mt-2 text-sm text-primary-700">
                  Créez votre premier événement pour permettre à vos clients de réserver des créneaux avec vous. 
                  Simple et rapide !
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link href={"/dashboard/events/new" as never}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer mon premier événement
                    </Button>
                  </Link>
                  <Link href={"/dashboard/settings" as never}>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configurer mon profil
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
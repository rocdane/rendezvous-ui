'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  Calendar,
  Clock,
  Settings,
  BarChart3,
  Home,
  Plus,
  Link as LinkIcon
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: Home },
  { name: 'Événements', href: '/dashboard/events', icon: Calendar },
  { name: 'Réservations', href: '/dashboard/bookings', icon: Clock },
  { name: 'Disponibilités', href: '/dashboard/availability', icon: Settings },
  { name: 'Statistiques', href: '/dashboard/analytics', icon: BarChart3 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-secondary-200 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <Calendar className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-secondary-900">
            RendezVous
          </span>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link
            href={"/dashboard/events/new" as never}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel événement
          </Link>
          <Link
            href={"/dashboard/share" as never}
            className="flex items-center px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Partager mon lien
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href as never}
                        className={clsx(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-secondary-700 hover:text-primary-700 hover:bg-primary-50'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            'h-6 w-6 shrink-0',
                            isActive ? 'text-primary-700' : 'text-secondary-400 group-hover:text-primary-700'
                          )}
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

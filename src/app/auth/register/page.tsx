'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/stores/auth';
import { Button, Input } from '@/components/ui';

const registerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["password_confirmation"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, isAuthenticated } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        ...data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-secondary-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-secondary-600">
          Déjà un compte ?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Se connecter
          </Link>
        </p>
      </div>

      <div className="mt-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Nom complet"
            type="text"
            autoComplete="name"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Adresse email"
            type="email"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            helperText="Au moins 8 caractères"
            {...register('password')}
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            autoComplete="new-password"
            required
            error={errors.password_confirmation?.message}
            {...register('password_confirmation')}
          />

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-secondary-900">
              Accepte les{' '}
              <Link href={"/terms" as never} className="text-primary-600 hover:text-primary-500">
                conditions utilisation
              </Link>{' '}
              et la{' '}
              <Link href={"/privacy" as never} className="text-primary-600 hover:text-primary-500">
                politique de confidentialité
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Créer mon compte
          </Button>
        </form>
      </div>
    </>
  );
}
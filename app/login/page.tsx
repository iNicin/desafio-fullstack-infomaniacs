"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) router.replace("/dashboard");
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-100 px-4">
      <div className="mx-auto flex min-h-screen max-w-md items-center">
        <section className="w-full rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <header className="mb-6">
            <p className="text-sm text-slate-500">Task Manager</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Entrar
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Acesse sua conta para gerenciar suas tarefas.
            </p>
          </header>

          <LoginForm />

          <footer className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-600">
            Não tem conta?{" "}
            <Link
              href="/register"
              className="font-medium text-slate-900 underline decoration-slate-400 underline-offset-4 hover:decoration-slate-900"
            >
              Criar agora
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { EverydaySituation } from '../types';
import { EVERYDAY_SITUATIONS, TEACHER_GUIDE } from '../data/curriculumData';
import { ResponseViewer } from './ResponseViewer';

type P = {
  isOpen: boolean;
  onClose: () => void;
  reproductionUnlocked: boolean;
  onToggleReproduction: (v: boolean) => void;
  studentQueries: any[];
  onClearQueries: () => void;
  onLaunchProjector: (s: EverydaySituation) => void;
  onResetInvestigation: () => void;
};
type AuthStatus = 'loading' | 'signedOut' | 'teacher' | 'forbidden';

export const TeacherDashboard: React.FC<P> = ({ isOpen, onClose, onLaunchProjector }) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<any>(null);
  const [issuedCode, setIssuedCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [course, setCourse] = useState('all');
  const [activity, setActivity] = useState('all');
  const [selected, setSelected] = useState('');
  const [tab, setTab] = useState('trabajos');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState('');

  // Supabase persists the browser session. Restore it on app startup and keep
  // React state in sync with refreshes, expiry, and manual sign-out.
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setAuthStatus('signedOut');
      return;
    }
    let active = true;
    const acceptSession = (nextSession: any) => {
      if (!active) return;
      if (!nextSession) {
        setSession(null);
        setAuthStatus('signedOut');
        return;
      }
      if (nextSession.user?.app_metadata?.role === 'docente') {
        setSession(nextSession);
        setAuthStatus('teacher');
        setError('');
        return;
      }
      setSession(null);
      setAuthStatus('forbidden');
      setError('Esta cuenta no tiene permisos docentes.');
      // Avoid awaiting signOut inside the Supabase auth callback.
      window.setTimeout(() => { void client.auth.signOut(); }, 0);
    };

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, nextSession) => {
      acceptSession(nextSession);
    });
    void client.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError) {
        setError('No se pudo recuperar la sesión. Iniciá sesión nuevamente.');
        setAuthStatus('signedOut');
        return;
      }
      acceptSession(data.session);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const load = async (): Promise<boolean> => {
    if (!supabase) {
      setError('Supabase no está configurado.');
      return false;
    }
    const [responses, mailbox] = await Promise.all([
      supabase.from('student_responses').select('id,student_id,activity,response,created_at,reviewed,students(first_name,last_name,course)').order('created_at', { ascending: false }),
      supabase.from('anonymous_questions').select('*').order('created_at', { ascending: false }),
    ]);
    if (responses.error || mailbox.error) {
      setError('No se pudieron cargar los datos. Revisá la conexión y los permisos de la cuenta docente.');
      return false;
    }
    setItems(responses.data || []);
    setQuestions(mailbox.data || []);
    setError('');
    return true;
  };

  useEffect(() => {
    if (authStatus === 'teacher' && isOpen) void load();
  }, [authStatus, isOpen]);

  if (!isOpen) return null;

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError('Supabase no está configurado.');
      return;
    }
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (loginError || !data.session) {
      setError('No se pudo iniciar sesión. Revisá el correo y la contraseña.');
      return;
    }
    if (data.session.user.app_metadata?.role !== 'docente') {
      setError('Esta cuenta no tiene permisos docentes.');
      await supabase.auth.signOut();
      setSession(null);
      setAuthStatus('forbidden');
      return;
    }
    setPassword('');
    setSession(data.session);
    setAuthStatus('teacher');
    setError('');
  };

  const refreshResponses = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshNotice('');
    const loaded = await load();
    setRefreshing(false);
    if (loaded) {
      setRefreshNotice('Respuestas actualizadas.');
      window.setTimeout(() => setRefreshNotice(''), 2500);
    }
  };

  const issueCode = async () => {
    if (!session) return;
    const code = crypto.randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase();
    const response = await fetch('/api/teacher/expediente2-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ code }),
    });
    if (!response.ok) {
      setError('No se pudo crear el código. Verificá que tu cuenta esté autorizada como docente.');
      return;
    }
    setIssuedCode(code);
    setError('');
  };

  const disableCode = async () => {
    if (!session) return;
    const response = await fetch('/api/teacher/expediente2-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ enabled: false }),
    });
    if (!response.ok) setError('No se pudo desactivar el código.');
    else setIssuedCode('');
  };

  const filtered = items.filter((item) => {
    const student = item.students || {};
    return (!search || `${student.first_name} ${student.last_name}`.toLowerCase().includes(search.toLowerCase()))
      && (course === 'all' || student.course === course)
      && (activity === 'all' || item.activity === activity)
      && (!selected || selected === item.student_id);
  });

  const update = async (id: string, reviewed: boolean) => {
    const { error: updateError } = await supabase!.from('student_responses').update({ reviewed }).eq('id', id);
    if (updateError) setError('No se pudo guardar el estado de revisión.');
    else await load();
  };
  const remove = async (id: string) => {
    const { error: deleteError } = await supabase!.from('student_responses').delete().eq('id', id);
    if (deleteError) setError('No se pudo eliminar la respuesta.');
    else await load();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3">
      <div className="my-6 max-h-[92vh] w-full max-w-5xl overflow-auto rounded-3xl bg-white shadow-2xl">
        <header className="flex justify-between bg-indigo-800 px-6 py-4 text-white">
          <div><h2 className="font-bold">Panel docente</h2><p className="text-xs">Trabajos identificados y buzón anónimo</p></div>
          <button onClick={onClose}>Cerrar ✕</button>
        </header>
        {authStatus === 'loading' && <div className="p-8 text-center text-sm text-slate-600" role="status">Comprobando sesión docente…</div>}
        {authStatus !== 'teacher' && authStatus !== 'loading' && <form onSubmit={login} className="mx-auto max-w-md space-y-4 p-8">
          <h3 className="text-lg font-bold">Ingreso docente</h3>
          <p className="text-sm text-slate-600">Cuenta docente autorizada en Supabase.</p>
          <input type="email" autoComplete="username" required placeholder="Correo" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border p-3" />
          <input type="password" autoComplete="current-password" required placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border p-3" />
          {error && <p className="text-sm text-rose-700" role="alert">{error}</p>}
          <button className="w-full rounded-xl bg-indigo-700 p-3 font-bold text-white">Ingresar</button>
        </form>}
        {authStatus === 'teacher' && <main className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <button onClick={() => setTab('trabajos')} className="rounded bg-indigo-50 px-3 py-2">Respuestas ({items.length})</button>
            <button onClick={() => setTab('buzon')} className="rounded bg-rose-50 px-3 py-2">Buzón anónimo ({questions.length})</button>
            <button onClick={() => setTab('guia')} className="rounded bg-amber-50 px-3 py-2">Guía docente</button>
            <button onClick={() => setTab('acceso')} className="rounded bg-emerald-50 px-3 py-2">Expediente 2</button>
            <button onClick={refreshResponses} disabled={refreshing} aria-label="Actualizar respuestas y buzón" className="ml-auto rounded-xl bg-indigo-700 px-4 py-2 font-semibold text-white disabled:cursor-wait disabled:opacity-60">{refreshing ? 'Actualizando...' : '🔄 Actualizar respuestas'}</button>
            <button onClick={async () => { await supabase?.auth.signOut(); setSession(null); setAuthStatus('signedOut'); setError(''); }} className="rounded-xl border px-3 py-2">Salir</button>
          </div>
          {refreshNotice && <p className="mb-3 text-sm text-emerald-700" role="status">{refreshNotice}</p>}
          {error && <p className="mb-3 text-sm text-rose-700" role="alert">{error}</p>}
          {tab === 'trabajos' && <>
            <div className="grid gap-2 sm:grid-cols-4">
              <input aria-label="Buscar alumno" placeholder="Buscar alumno" value={search} onChange={(event) => setSearch(event.target.value)} className="rounded-xl border p-2" />
              <select aria-label="Filtrar por curso" value={course} onChange={(event) => setCourse(event.target.value)} className="rounded-xl border p-2"><option value="all">Todos los cursos</option>{[...new Set(items.map((item) => item.students?.course).filter(Boolean))].map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="Filtrar por actividad" value={activity} onChange={(event) => setActivity(event.target.value)} className="rounded-xl border p-2"><option value="all">Todas las actividades</option>{[...new Set(items.map((item) => item.activity))].map((item) => <option key={item}>{item}</option>)}</select>
              <select aria-label="Seleccionar alumno" value={selected} onChange={(event) => setSelected(event.target.value)} className="rounded-xl border p-2"><option value="">Todos los alumnos</option>{[...new Map(items.map((item) => [item.student_id, item.students])).entries()].map(([id, student]: any) => <option key={id} value={id}>{student?.last_name}, {student?.first_name} · {student?.course}</option>)}</select>
            </div>
            <div className="mt-4 space-y-4">{filtered.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-indigo-100 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-indigo-100 bg-indigo-50/60 p-4">
                <div><p className="text-base font-bold text-slate-900">{item.students?.first_name} {item.students?.last_name}</p><p className="text-sm text-slate-600">{item.students?.course}</p><p className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-800">{item.activity}</p></div>
                <div className="text-right"><time className="text-xs text-slate-600">{new Date(item.created_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</time><p className={`mt-2 text-xs font-bold ${item.reviewed ? 'text-emerald-700' : 'text-amber-700'}`}>{item.reviewed ? '✓ Revisado' : 'Pendiente'}</p></div>
              </div>
              <div className="space-y-3 bg-slate-50/60 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Respuestas enviadas</p><ResponseViewer response={item.response} /></div>
              <div className="flex justify-end gap-4 border-t border-slate-100 p-3"><button onClick={() => void update(item.id, !item.reviewed)} className="text-sm font-semibold text-emerald-700">{item.reviewed ? 'Marcar pendiente' : 'Marcar revisado'}</button><button onClick={() => void remove(item.id)} className="text-sm font-semibold text-rose-700">Eliminar</button></div>
            </article>)}{!filtered.length && <p className="p-8 text-center text-sm text-slate-600">No hay envíos para estos filtros.</p>}</div>
          </>}
          {tab === 'acceso' && <section className="space-y-3 rounded-2xl border p-5"><h3 className="font-bold">Acceso al Expediente 2</h3><p className="text-sm text-slate-600">Generá un código cuando quieras abrir esta etapa. Copialo y compartilo con el curso; por seguridad se muestra una sola vez. Al generar otro código, el anterior deja de funcionar para nuevos accesos.</p><div className="flex flex-wrap gap-2"><button onClick={() => void issueCode()} className="rounded-xl bg-indigo-700 px-4 py-2 font-bold text-white">Generar código</button><button onClick={() => void disableCode()} className="rounded-xl border px-4 py-2">Desactivar código</button></div>{issuedCode && <div className="rounded-xl bg-emerald-50 p-4"><p className="text-xs">Código para compartir:</p><strong className="select-all text-2xl tracking-widest">{issuedCode}</strong><p className="text-xs">Anotalo ahora; no se podrá volver a consultar desde el panel.</p></div>}</section>}
          {tab === 'buzon' && <div className="space-y-3">{questions.map((question) => <article key={question.id} className="rounded-xl border border-rose-100 bg-rose-50/40 p-4"><small className="text-slate-600">Anónima · {question.category} · {new Date(question.created_at).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</small><p className="mt-2 font-bold">{question.question}</p><p className="mt-1 whitespace-pre-wrap text-sm">{question.answer}</p></article>)}{!questions.length && <p className="p-8 text-center text-sm text-slate-600">No hay preguntas en el buzón.</p>}</div>}
          {tab === 'guia' && <><h3 className="font-bold">{TEACHER_GUIDE.title}</h3><p>{TEACHER_GUIDE.purpose}</p>{TEACHER_GUIDE.didacticMoments.map((moment) => <p key={moment.stage}><b>{moment.stage}</b>: {moment.suggestedActivity}</p>)}{EVERYDAY_SITUATIONS.map((situation) => <button key={situation.id} className="m-1 rounded border p-2" onClick={() => { onClose(); onLaunchProjector(situation); }}>{situation.title}</button>)}</>}
        </main>}
      </div>
    </div>
  );
};

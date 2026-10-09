import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export type StudentIdentity = { id: string; first_name: string; last_name: string; course: string };

export async function registerStudentIdentity(student: StudentIdentity) {
  if (!supabase) throw new Error('La aplicación todavía no está conectada a Supabase.');
  const { error } = await supabase.from('students').insert(student);
  if (error && error.code !== '23505') throw error;
}

export async function saveStudentActivity(student: StudentIdentity, activity: string, response: unknown) {
  if (!supabase) throw new Error('La aplicación todavía no está conectada a Supabase.');
  await registerStudentIdentity(student);
  const { error } = await supabase.from('student_responses').insert({
    student_id: student.id,
    activity,
    response: typeof response === 'string' ? response : JSON.stringify(response),
  });
  if (error) throw error;
}

export async function saveAnonymousQuestion(question: string, category: string, answer: string) {
  if (!supabase) throw new Error('La aplicación todavía no está conectada a Supabase.');
  const { error } = await supabase.from('anonymous_questions').insert({ question, category, answer });
  if (error) throw error;
}

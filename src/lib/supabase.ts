import { createClient } from '@supabase/supabase-js';
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const supabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }) : null;
export const teacherSupabase = url && anonKey ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, storageKey: 'cca_teacher_auth' } }) : null;
export type StudentIdentity = { id: string; email: string; first_name?: string | null; last_name?: string | null; course?: string | null };
export function isInstitutionalEmail(value: string) { return /^[A-Z0-9._%+-]+@grilli\.edu\.ar$/i.test(value.trim()); }
export async function studentIdFromEmail(email: string) {
 const normalized=email.trim().toLowerCase(); const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`cca:${normalized}`)); const bytes=new Uint8Array(digest).slice(0,16); bytes[6]=(bytes[6]&15)|80; bytes[8]=(bytes[8]&63)|128; const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join(''); return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export async function registerStudentIdentity(student: StudentIdentity) { if(!supabase)throw new Error('La aplicación todavía no está conectada a Supabase.'); const {error}=await supabase.from('students').insert({id:student.id,email:student.email.trim().toLowerCase()}); if(error&&error.code!=='23505')throw error; }
export async function saveStudentActivity(student: StudentIdentity, activity: string, response: unknown) { if(!supabase)throw new Error('La aplicación todavía no está conectada a Supabase.'); await registerStudentIdentity(student); const {error}=await supabase.from('student_responses').insert({student_id:student.id,activity,response:typeof response==='string'?response:JSON.stringify(response)}); if(error)throw error; }
export async function saveAnonymousQuestion(question:string,category:string,answer:string){if(!supabase)throw new Error('La aplicación todavía no está conectada a Supabase.');const {error}=await supabase.from('anonymous_questions').insert({question,category,answer});if(error)throw error;}
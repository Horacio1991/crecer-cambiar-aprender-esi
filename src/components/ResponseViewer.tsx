import React from 'react';

const labels: Record<string, string> = {
  pregunta: 'Pregunta', question: 'Pregunta',
  respuesta: 'Respuesta del alumno', answer: 'Respuesta del alumno',
  selected: 'Opción seleccionada', seleccionada: 'Opción seleccionada',
  textolibre: 'Texto del alumno', freetext: 'Texto del alumno',
  situacion: 'Situación', situation: 'Situación',
  nivel: 'Nivel', level: 'Nivel',
  resultado: 'Resultado', result: 'Resultado',
  puntaje: 'Puntaje', score: 'Puntaje', total: 'Total de preguntas',
  respuestas: 'Respuestas', responses: 'Respuestas',
  explicacion: 'Explicación', explanation: 'Explicación',
  actividad: 'Actividad', activity: 'Actividad',
};

function displayLabel(key: string): string {
  const normalized = key.replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
  return labels[normalized.replace(/\s/g, '').toLowerCase()] ?? normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function printable(value: unknown): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return null;
}

function RecordView({ value, depth = 0 }: { value: Record<string, unknown>; depth?: number }) {
  if (depth > 5) return <p className="text-sm text-slate-600">Detalle de la respuesta omitido.</p>;
  const entries = Object.entries(value).filter(([key, item]) =>
    item !== null && item !== undefined && !['id', 'student_id', 'created_at', 'updated_at'].includes(key.toLowerCase()),
  );
  const score = value.puntaje ?? value.score;
  const total = value.total;
  const hasScore = score !== undefined && score !== null;

  return (
    <div className="space-y-3">
      {hasScore && (
        <section className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-800">Resultado</h4>
          <p className="mt-1 text-sm font-semibold text-slate-800">Puntaje: {printable(score)}{total != null ? ` de ${printable(total)}` : ''}</p>
        </section>
      )}
      {entries.map(([key, item]) => {
        if (hasScore && (key === 'puntaje' || key === 'score' || key === 'total')) return null;
        const label = displayLabel(key);
        if (Array.isArray(item)) {
          return <section key={key} className="space-y-2"><h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</h4>{item.map((child, index) => <div key={index} className="rounded-xl border border-slate-200 bg-white p-3"><p className="mb-2 text-xs font-bold text-slate-500">Respuesta {index + 1}</p>{child && typeof child === 'object' ? <RecordView value={child as Record<string, unknown>} depth={depth + 1} /> : <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{printable(child) ?? 'Sin respuesta'}</p>}</div>)}</section>;
        }
        if (item && typeof item === 'object') {
          return <section key={key} className="rounded-xl border border-slate-200 bg-white p-3"><h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</h4><RecordView value={item as Record<string, unknown>} depth={depth + 1} /></section>;
        }
        const text = printable(item);
        if (text === null) return null;
        const isQuestion = ['pregunta', 'question', 'situacion', 'situation'].includes(key.toLowerCase());
        const isAnswer = ['respuesta', 'answer', 'selected', 'seleccionada', 'textolibre', 'freetext'].includes(key.toLowerCase());
        return <section key={key} className={`rounded-xl border p-3 ${isAnswer ? 'border-emerald-100 bg-emerald-50/60' : isQuestion ? 'border-sky-100 bg-sky-50/60' : 'border-slate-200 bg-white'}`}><h4 className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</h4><p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{text}</p></section>;
      })}
      {!entries.length && depth === 0 && <p className="text-sm text-slate-600">No hay una respuesta disponible.</p>}
    </div>
  );
}

export function ResponseViewer({ response }: { response: unknown }) {
  let value = response;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">Sin respuesta escrita.</p>;
    if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"')) {
      try {
        value = JSON.parse(trimmed);
        if (typeof value === 'string') {
          try { value = JSON.parse(value); } catch { /* Keep the decoded plain text. */ }
        }
      } catch {
        return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{trimmed}</p>;
      }
    }
  }

  if (Array.isArray(value)) {
    return <div className="space-y-3">{value.map((item, index) => <div key={index} className="rounded-xl border border-slate-200 bg-white p-3"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Pregunta {index + 1}</p>{item && typeof item === 'object' ? <RecordView value={item as Record<string, unknown>} /> : <p className="whitespace-pre-wrap break-words text-sm">{printable(item) ?? 'Sin respuesta'}</p>}</div>)}</div>;
  }
  if (value && typeof value === 'object') return <RecordView value={value as Record<string, unknown>} />;
  return <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{printable(value) ?? 'No hay una respuesta disponible.'}</p>;
}

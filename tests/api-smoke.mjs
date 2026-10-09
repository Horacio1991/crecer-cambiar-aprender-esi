import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL || 'http://127.0.0.1:3000';
const code = process.env.TEST_EXPEDIENTE2_CODE || process.env.EXPEDIENTE2_CODE;
assert.ok(code, 'Definí TEST_EXPEDIENTE2_CODE o EXPEDIENTE2_CODE para esta prueba local.');

const locked = await fetch(`${base}/api/expediente2`);
assert.equal(locked.status, 401, 'El contenido debe denegarse sin permiso firmado.');

const bad = await fetch(`${base}/api/unlock-expediente2`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:'incorrecto'})});
assert.equal(bad.status, 401, 'Un código incorrecto no debe desbloquear contenido.');

const good = await fetch(`${base}/api/unlock-expediente2`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code})});
assert.equal(good.status, 200, 'El código correcto debe generar un permiso.');
const {token} = await good.json();
assert.ok(token, 'La API debe devolver un permiso firmado.');

const contents = await fetch(`${base}/api/expediente2`, {headers:{Authorization:`Bearer ${token}`}});
assert.equal(contents.status, 200);
const module = await contents.json();
assert.equal(module.sections.length, 6, 'El contenido protegido debe entregarse completo tras validar.');

const fakeClientUnlock = await fetch(`${base}/api/ask-question`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:'¿Qué es la fecundación?',reproductionUnlocked:true})});
assert.equal(fakeClientUnlock.status, 200);
assert.equal((await fakeClientUnlock.json()).reproductionBlocked, true, 'Un booleano del cliente no puede habilitar respuestas reproductivas.');

const authorizedQuestion = await fetch(`${base}/api/ask-question`, {method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({question:'¿Qué es la fecundación?'})});
assert.equal(authorizedQuestion.status, 200);
assert.notEqual((await authorizedQuestion.json()).reproductionBlocked, true, 'El permiso válido habilita la respuesta local/Gemini correspondiente.');

const page = await fetch(base);
assert.equal(page.status, 200, 'El servidor de producción debe servir el frontend.');
console.log('API smoke tests passed: locked, invalid code, valid code, signed content, server-side lock, unlocked fallback, production page.');

import { EverydaySituation, DetectiveQuestion, LevelModule } from '../types';

export const CORE_MESSAGE =
  '“Crecer no significa solamente cambiar físicamente. También aprendemos a comprender nuestras emociones, construir vínculos, cuidar nuestro cuerpo y respetar los tiempos y las diferencias de cada persona.”';

export const CHARACTERS = {
  sofia: {
    name: 'Sofía',
    age: '11 años',
    grade: '6.º grado',
    traits: 'Curiosa, observadora y sensible.',
    description:
      'A veces tiene dudas sobre los cambios que experimenta y se preocupaba al compararse con sus compañeras. Va aprendiendo que cada cuerpo tiene sus propios tiempos.',
    sampleQuotes: [
      '“Pensé que era raro que algunas amigas ya hubieran empezado a cambiar y yo no.”',
      '“No sabía que las emociones también podían cambiar y sentirse tan intensas durante esta etapa.”',
      '“¿Por qué a algunas personas les pasa antes que a otras? Ahora entiendo que cada cuerpo tiene su propio ritmo.”',
    ],
    avatarBg: 'bg-emerald-100 border-emerald-400 text-emerald-800',
    tagColor: 'bg-emerald-600 text-white',
  },
  mateo: {
    name: 'Mateo',
    age: '12 años',
    grade: '6.º grado',
    traits: 'Curioso, sociable y le gusta hacer preguntas.',
    description:
      'A veces se siente incómodo frente a cambios que no comprende o tiene pequeños desacuerdos con amigos. Va aprendiendo que hablar, escuchar y respetar los límites ayuda a resolver problemas.',
    sampleQuotes: [
      '“Últimamente siento que algunas cosas me molestan más que antes o me ponen impaciente.”',
      '“Un amigo empezó a cambiar antes que yo y pensé que algo estaba mal conmigo.”',
      '“A veces discutimos por cosas pequeñas y después nos damos cuenta de que podríamos haber hablado primero.”',
    ],
    avatarBg: 'bg-sky-100 border-sky-400 text-sky-800',
    tagColor: 'bg-sky-600 text-white',
  },
};

export const LEVELS: LevelModule[] = [
  {
    id: 1,
    slug: 'crecer',
    title: 'Nivel 1: ¿Qué significa crecer?',
    subtitle: 'La pubertad como una etapa de transformaciones y descubrimientos',
    iconName: 'Compass',
    summary:
      'Crecer es un proceso integral. Durante la pubertad (que suele comenzar entre los 9 y los 14 años, según cada persona) el organismo, la mente y las relaciones atraviesan transformaciones importantes.',
    keyConcepts: [
      {
        title: 'La pubertad no es una carrera',
        description:
          'No hay una fecha exacta fija ni un botón de encendido simultáneo para todas las personas. Cada individuo posee su propio "reloj biológico" regulado por factores genéticos y de salud.',
        sofiaOrMateo: 'sofia',
        quote: '“Al principio miraba a mis compañeras más altas y me daba intriga. Después comprendí que todas las personas tenemos calendarios distintos.”',
      },
      {
        title: 'Crecer va más allá de medir más centímetros',
        description:
          'El crecimiento no es solo ganar altura o fuerza: incluye cómo pensamos, cómo nos sentimos frente al mundo, la capacidad de tomar decisiones más autónomas y aprender a cuidar de uno mismo y de los demás.',
        sofiaOrMateo: 'mateo',
        quote: '“Crecer también es aprender a decir lo que nos pasa sin gritar y entender qué cosas nos hacen bien.”',
      },
    ],
    diversityNote:
      'No existe un único ritmo correcto para desarrollarse. Compararse con otras personas suele generar preocupaciones innecesarias; la diversidad de estaturas, ritmos y formas es natural y saludable.',
    reflectionPrompt: '¿Qué cambios notás en tus gustos, tus pensamientos o tu vida cotidiana respecto a cuando estabas en 4.º o 5.º grado?',
  },
  {
    id: 2,
    slug: 'cambios-fisicos',
    title: 'Nivel 2: Cambios Físicos',
    subtitle: 'Modificaciones observables en el cuerpo durante la pubertad',
    iconName: 'Sparkles',
    summary:
      'El cuerpo humano experimenta cambios visibles y biológicos. Estos cambios no ocurren todos juntos ni en el mismo orden en cada persona.',
    keyConcepts: [
      {
        title: 'El "estirón" y cambios en las proporciones',
        description:
          'Las extremidades (brazos y piernas) suelen crecer primero, lo que a veces produce una sensación de descoordinación temporal. Luego se ensanchan los hombros o las caderas.',
      },
      {
        title: 'Aparición de vello corporal y cambios en la piel',
        description:
          'Aparece vello en las axilas, en la zona genital (vello púbico) y en las piernas o la cara. Las glándulas sebáceas y sudoríparas se vuelven más activas, lo que puede originar acné y olor corporal más notorio.',
        sofiaOrMateo: 'mateo',
        quote: '“El olor a transpiración cambió un montón. Lavarse a diario y usar desodorante pasó a ser parte de mi rutina de todos los días.”',
      },
      {
        title: 'Modificaciones en el tono de la voz',
        description:
          'La laringe y las cuerdas vocales crecen. En muchas personas, especialmente en quienes producen más andrógenos, la voz se vuelve más grave y a veces experimenta "gallos" o quiebres pasajeros.',
      },
      {
        title: 'Desarrollo del pecho y genitales',
        description:
          'En los cuerpos femeninos se produce el desarrollo de las mamas (a menudo un pecho crece antes que el otro, lo cual es normal). En los cuerpos masculinos crecen los testículos y el pene. También pueden comenzar la menstruación y las primeras eyaculaciones (o emisiones nocturnas).',
        sofiaOrMateo: 'sofia',
        quote: '“Saber qué puede ocurrir antes de que pase te da tranquilidad y te saca el miedo a lo desconocido.”',
      },
    ],
    diversityNote:
      'Estos cambios no son una lista obligatoria ni suceden al unísono. Que a alguien no le haya ocurrido determinado cambio todavía no significa que haya un problema: cada cuerpo tiene sus propios tiempos.',
    reflectionPrompt: '¿Por qué es fundamental que nadie haga comentarios ni bromas sobre los cambios en el cuerpo de sus compañeros?',
  },
  {
    id: 3,
    slug: 'cambios-hormonales',
    title: 'Nivel 3: Cambios Hormonales',
    subtitle: 'Las mensajeras químicas que coordinan las transformaciones',
    iconName: 'Activity',
    summary:
      'Las hormonas son sustancias producidas por glándulas de nuestro organismo que viajan a través de la sangre llevando instrucciones específicas a diferentes órganos y tejidos.',
    keyConcepts: [
      {
        title: '¿Quién da la primera señal?',
        description:
          'En la base del cerebro, una pequeña glándula llamada hipófisis (o pituitaria) comienza a liberar hormonas que estimulan a las gónadas (ovarios y testículos) a activarse y producir sus propias hormonas.',
      },
      {
        title: 'Estrógenos, progesterona y testosterona',
        description:
          'Los ovarios producen principalmente estrógenos y progesterona; los testículos producen principalmente testosterona. Todos los cuerpos humanos tienen estas hormonas en distintas proporciones.',
        sofiaOrMateo: 'mateo',
        quote: '“¡Son como pequeños mensajes de correo que viajan por el cuerpo diciendo: \'es hora de empezar a madurar!\'”',
      },
      {
        title: 'Efectos en los órganos y tejidos',
        description:
          'Estas hormonas ordenan el crecimiento de los huesos, el desarrollo muscular, el cambio en las glándulas sudoríparas y preparan biológicamente al cuerpo hacia la madurez adulta.',
      },
    ],
    diversityNote:
      'Las hormonas actúan de forma gradual, a lo largo de varios años. No provocan cambios mágicos de un día para el otro, sino un proceso de maduración continuo y armónico.',
    reflectionPrompt: '¿Te imaginabas que el cerebro y las glándulas trabajaban juntos como un equipo de mensajería para que crezcamos?',
  },
  {
    id: 4,
    slug: 'cambios-emocionales',
    title: 'Nivel 4: Cambios Emocionales',
    subtitle: 'Nuevas intensidades, autoconocimiento y necesidad de privacidad',
    iconName: 'HeartHandshake',
    summary:
      'Crecer también sacude el mundo interno. Las emociones pueden sentirse con más fuerza o cambiar más rápido, y es una etapa en la que nos preguntamos quiénes somos y qué nos gusta.',
    keyConcepts: [
      {
        title: 'Emociones más intensas y variadas',
        description:
          'Un día podés sentir mucha euforia o entusiasmo, y al siguiente sentirte más pensativo, sensible o impaciente. Esto no significa "ser irracional": es parte de procesar tantas cosas nuevas a la vez.',
        sofiaOrMateo: 'sofia',
        quote: '“A veces lloro de risa por algo mínimo y a la tarde me siento un poco bajón sin una razón clara. Aprender a aceptar lo que siento me dio alivio.”',
      },
      {
        title: 'La necesidad de privacidad y espacio propio',
        description:
          'Comenzamos a valorar momentos a solas en nuestra habitación, tener un diario personal o pensar sin interrupciones. Querer privacidad es un derecho sano y no significa estar enojado con la familia.',
      },
      {
        title: 'Autoestima y el peligro de la comparación',
        description:
          'Mirar constantemente lo que hacen los demás, cómo se visten o cómo se ven puede generar inseguridad. La clave es construir la confianza en nuestras propias cualidades y talentos.',
        sofiaOrMateo: 'mateo',
        quote: '“Cuando dejé de mirar cuánto medían mis amigos y me enfoqué en lo que a mí me gustaba hacer, me sentí mucho más libre.”',
      },
    ],
    diversityNote:
      'No hay emociones "malas" ni "prohibidas". El enojo, la tristeza o la vergüenza son señales que nos indican qué nos pasa. Lo importante es no lastimarnos ni lastimar a otros al expresarlas.',
    reflectionPrompt: '¿Qué hacés cuando sentís una emoción muy fuerte para sentirte mejor sin perjudicar a los demás?',
  },
  {
    id: 5,
    slug: 'cambios-vinculares',
    title: 'Nivel 5: Cambios Vinculares',
    subtitle: 'Amistades, pertenencia, acuerdos y autonomía con respeto',
    iconName: 'Users',
    summary:
      'Nuestras relaciones cambian: los amigos y los grupos escolares cobran un rol central, buscamos más independencia de los adultos y aprendemos a resolver desacuerdos cotidianos.',
    keyConcepts: [
      {
        title: 'El valor de los grupos y el deseo de pertenecer',
        description:
          'Compartir gustos, música, juegos o charlas con pares es hermoso. Sin embargo, pertenecer a un grupo nunca debe implicar hacer cosas con las que no nos sentimos cómodos solo por "encajar".',
        sofiaOrMateo: 'mateo',
        quote: '“Un buen grupo de amigos te acepta tal como sos, no te exige cambiar para que no te dejen afuera.”',
      },
      {
        title: 'Desacuerdos normales vs. maltrato o burlas',
        description:
          'Tener opiniones distintas o discutir sobre un juego o una idea es normal y parte de la convivencia. La diferencia con el maltrato es que en un desacuerdo hay respeto mutuo y no se busca humillar ni lastimar.',
      },
      {
        title: 'Poner límites, decir "NO" y pedir disculpas',
        description:
          'Aprender a poner un límite claro cuando algo nos incomoda es fundamental para el autocuidado. Del mismo modo, si nos equivocamos o incomodamos a alguien, saber pedir una disculpa sincera fortalece los lazos.',
        sofiaOrMateo: 'sofia',
        quote: '“Decir \'no me gusta que me digas ese apodo\' no es ser mala onda: es cuidar nuestro respeto mutuo.”',
      },
      {
        title: 'Autonomía y diálogo con adultos de confianza',
        description:
          'Queremos decidir más cosas por nuestra cuenta, pero contar con familiares, docentes o profesionales de la salud nos brinda un apoyo clave frente a dudas complejas.',
      },
    ],
    diversityNote:
      'Cada persona tiene formas distintas de vincularse: algunas prefieren grupos grandes y ruidosos, otras prefieren uno o dos amigos íntimos. Ambas formas son válidas y respetables.',
    reflectionPrompt: '¿Qué hacés cuando tenés un desacuerdo con un amigo para llegar a un acuerdo sin pelear?',
  },
];

export const EXPEDIENTE_2_DATA = {
  title: 'Expediente 2: ¿Qué ocurre dentro del cuerpo?',
  subtitle: 'Anatomía, fisiología y reproducción humana con rigor científico y respeto',
  statusDescription:
    'Este módulo aborda los sistemas reproductores, las células especializadas y los procesos biológicos de la reproducción humana, habilitado bajo orientación pedagógica docente.',
  sections: [
    {
      number: '1',
      title: 'Hormonas y maduración sexual',
      description:
        'Durante la pubertad, las hormonas gonadotrópicas estimulan a los ovarios y a los testículos para que alcancen su madurez biológica y comiencen a producir células reproductoras de forma regular.',
      detail:
        'La maduración biológica es un proceso paulatino. El cuerpo adquiere gradualmente la capacidad reproductiva, aunque la madurez emocional y vincular para criar a una persona requiere muchos más años y proyectos de vida adultos.',
    },
    {
      number: '2',
      title: 'Sistema reproductor femenino',
      description:
        'Está integrado por órganos externos (vulva: labios mayores y menores, clítoris, meato urinario y orificio vaginal) y órganos internos (vagina, útero, trompas de Falopio y ovarios).',
      detail:
        'Los ovarios almacenan y maduran los óvulos. Cada mes, en el ciclo menstrual, un óvulo maduro viaja por la trompa de Falopio hacia el útero, cuyo revestimiento interno (endometrio) se prepara. Si no hay fecundación, ese tejido se desprende produciendo la menstruación.',
    },
    {
      number: '3',
      title: 'Sistema reproductor masculino',
      description:
        'Está integrado por el pene y el escroto (que contiene y protege a los testículos), junto con conductos internos (epidídimos, conductos deferentes, vesículas seminales y próstata).',
      detail:
        'Los testículos producen espermatozoides y testosterona. Los espermatozoides se mezclan con líquidos nutritivos producidos por la próstata y las vesículas seminales formando el semen, que puede salir del cuerpo a través de la uretra mediante la eyaculación.',
    },
    {
      number: '4',
      title: 'Células reproductoras: óvulos y espermatozoides',
      description:
        'Son células especializadas llamadas gametos que contienen la mitad de la información genética de la persona.',
      detail:
        'El óvulo es una de las células más grandes del cuerpo humano, redonda e inmóvil por sí misma. El espermatozoide es mucho más pequeño y posee una cola móvil (flagelo) que le permite desplazarse.',
    },
    {
      number: '5',
      title: 'La fecundación',
      description:
        'La fecundación es la unión biológica de un óvulo y un espermatozoide, generalmente en las trompas de Falopio.',
      detail:
        'Al unirse, combinan su material genético formando una nueva célula única llamada cigoto, que comienza a dividirse rápidamente mientras viaja hacia el útero.',
    },
    {
      number: '6',
      title: 'El desarrollo de una nueva vida',
      description:
        'En el útero materno ocurre la implantación. El embrión se desarrolla a lo largo de aproximadamente 9 meses (gestación o embarazo), protegido por el líquido amniótico y nutrido mediante la placenta y el cordón umbilical, hasta el nacimiento.',
      detail:
        'Tener un hijo o hija es una gran responsabilidad humana, afectiva y social que requiere proyecto personal, consentimiento, madurez y cuidado mutuo.',
    },
  ],
};

export const EVERYDAY_SITUATIONS: EverydaySituation[] = [
  {
    id: 'sit-1',
    title: 'Sofía y la necesidad de un momento a solas',
    protagonist: 'sofia',
    tag: 'Privacidad y Emociones',
    context: 'Al terminar la clase de gimnasia, en el aula.',
    story:
      'Sofía tuvo un día agotador: siente que le duele la cabeza, le costó concentrarse y solo quiere sentarse en silencio en un rincón del patio a leer o pensar. Una amiga se acerca a contarle una anécdota y, al ver que Sofía no le contesta con entusiasmo, piensa que Sofía está enojada con ella o que ya no quiere ser su amiga.',
    guidingQuestions: [
      {
        question: '¿Qué podría estar sintiendo Sofía?',
        hint: 'Pensá en cómo te sentís cuando estás saturado o cansado.',
        possibleAnswers: [
          {
            text: 'Está abrumada y necesita descansar en privado para calmarse.',
            reflection: '¡Exacto! Querer un momento de tranquilidad para recargar energías es completamente natural y saludable.',
            isConstructive: true,
          },
          {
            text: 'Seguro tiene bronca oculta y quiere cortar la amistad.',
            reflection: 'A veces podemos sacar conclusiones apuradas sin saber qué le pasa a la otra persona por dentro.',
            isConstructive: false,
          },
        ],
      },
      {
        question: '¿Qué podría pensar su amiga y por qué ocurre este malentendido?',
        hint: 'La amiga no puede leer la mente de Sofía.',
        possibleAnswers: [
          {
            text: 'Su amiga siente rechazo porque interpreta el silencio como enojo directo hacia ella.',
            reflection: 'Muy buena observación: cuando alguien no expresa lo que le pasa, el otro puede atribuírselo a sí mismo.',
            isConstructive: true,
          },
        ],
      },
      {
        question: '¿Qué podrían hacer ambas para resolverlo sin herirse?',
        hint: '¿Cómo expresar una necesidad sin rechazar a la otra persona?',
        possibleAnswers: [
          {
            text: 'Sofía puede decirle con calidez: "Hoy estoy con dolor de cabeza y necesito unos minutos sola, no tiene nada que ver con vos; ¡después te escucho!".',
            reflection: '¡Excelente propuesta! Poner en palabras nuestra necesidad de privacidad con afecto evita confusiones y cuida el vínculo.',
            isConstructive: true,
          },
          {
            text: 'No decirse nada durante tres días hasta que a alguna se le pase el enojo.',
            reflection: 'La falta de diálogo suele agrandar los malentendidos en vez de resolverlos.',
            isConstructive: false,
          },
        ],
      },
    ],
    keyTakeaway:
      'Necesitar privacidad no significa dejar de querer a los amigos. Aprender a comunicar cómo nos sentimos evita malos entendidos y nos ayuda a cuidarnos mutuamente.',
  },
  {
    id: 'sit-2',
    title: 'Mateo y el desacuerdo durante el recreo',
    protagonist: 'mateo',
    tag: 'Amistad y Desacuerdos',
    context: 'En el patio escolar a la hora del recreo largo.',
    story:
      'Mateo quería jugar a la mancha cadena con todo el grupo, pero su mejor amigo quería jugar a la pelota en la cancha chica. Empezaron a discutir levantando la voz: "¿Siempre querés hacer lo que vos querés!", le dijo su amigo. Mateo se sintió herido y le dieron ganas de gritarle algo feo.',
    guidingQuestions: [
      {
        question: '¿Es normal tener desacuerdos con nuestros amigos?',
        hint: '¿Todas las personas piensan igual siempre?',
        possibleAnswers: [
          {
            text: 'Sí, es completamente normal: somos personas distintas con gustos y deseos que a veces no coinciden.',
            reflection: '¡Así es! Tener desacuerdos no significa que la amistad se haya roto, sino que hay que buscar acuerdos.',
            isConstructive: true,
          },
          {
            text: 'No, los verdaderos amigos nunca deberían estar en desacuerdo.',
            reflection: 'Esa es una idea equivocada: incluso las personas que más se quieren tienen opiniones y gustos diferentes.',
            isConstructive: false,
          },
        ],
      },
      {
        question: '¿Qué diferencia hay entre discutir un desacuerdo y maltratar?',
        hint: 'Pensá en las palabras que se eligen y en el objetivo.',
        possibleAnswers: [
          {
            text: 'En un desacuerdo se debate sobre el juego o la regla sin descalificar. El maltrato ataca a la persona con insultos o burlas para hacerla sentir mal.',
            reflection: '¡Distinción clave! Se puede estar en desacuerdo con fuerza, pero siempre cuidando la dignidad del otro.',
            isConstructive: true,
          },
        ],
      },
      {
        question: '¿Cómo podrían resolverlo Mateo y su amigo?',
        hint: '¿Existe una solución donde nadie pierda todo?',
        possibleAnswers: [
          {
            text: 'Proponer jugar medio recreo a la mancha y medio recreo a la pelota, o alternar un día cada uno.',
            reflection: '¡Genial! Negociar y ceder un poco de cada lado es la base de la convivencia democrática y la amistad.',
            isConstructive: true,
          },
          {
            text: 'Dejarse de hablar y obligar a los demás a elegir a cuál de los dos prefieren.',
            reflection: 'Armar bandos genera malestar en todo el grado y empeora el conflicto.',
            isConstructive: false,
          },
        ],
      },
    ],
    keyTakeaway:
      'Escuchar al otro no significa darle la razón en todo, sino prestar atención genuina a lo que propone. Los desacuerdos se resuelven conversando y buscando acuerdos compartidos.',
  },
  {
    id: 'sit-3',
    title: 'Comentarios sobre el cuerpo de una compañera',
    protagonist: 'compartida',
    tag: 'Respeto al Cuerpo',
    context: 'En la fila antes de entrar al salón de música.',
    story:
      'Una compañera comenzó a experimentar el desarrollo de su cuerpo antes que la mayoría del grupo (creció más rápido de estatura y sus mamas empezaron a notarse). En la fila, un grupito de chicos empezó a mirarla, a murmurar y a hacer chistes en voz baja sobre su cambio. La compañera bajó la cabeza, cruzó los brazos para taparse y se puso muy incómoda.',
    guidingQuestions: [
      {
        question: '¿Qué siente la compañera frente a esa situación?',
        hint: '¿Cómo te sentirías si hablaran de tu cuerpo sin tu permiso?',
        possibleAnswers: [
          {
            text: 'Siente vergüenza, invasión de su intimidad, tristeza e inseguridad sobre sí misma.',
            reflection: 'Totalmente. Que los demás opinen sobre nuestro cuerpo genera una sensación muy fea de vulnerabilidad.',
            isConstructive: true,
          },
          {
            text: 'Seguro le gusta llamar la atención porque es más alta.',
            reflection: 'No: los cambios corporales biológicos no se eligen para llamar la atención; son procesos naturales.',
            isConstructive: false,
          },
        ],
      },
      {
        question: '¿Cuál es la regla de oro del respeto hacia el cuerpo ajeno?',
        hint: '¿Quién es dueño de cada cuerpo?',
        possibleAnswers: [
          {
            text: 'Nunca se opina, bromea ni juzga el cuerpo de otra persona: cada cuerpo es privado, único y merece respeto.',
            reflection: '¡Regla fundamental de la ESI y la convivencia humana! Ningún cuerpo está en exhibición para el comentario ajeno.',
            isConstructive: true,
          },
        ],
      },
      {
        question: 'Si somos testigos de algo así, ¿qué podemos hacer como compañeros?',
        hint: 'El silencio de los testigos a veces valida a los que molestan.',
        possibleAnswers: [
          {
            text: 'Frenar los comentarios diciendo: "Che, no da hablar del cuerpo de nadie", y acercarse a la compañera para apoyarla o avisar a la docente.',
            reflection: '¡Excelente actitud empática! Poner un límite colectivo protege a quien está pasando un mal momento.',
            isConstructive: true,
          },
          {
            text: 'Reírse para no quedar mal con los que hacen los chistes.',
            reflection: 'Reírse avala la burla y lastima aún más a la persona afectada.',
            isConstructive: false,
          },
        ],
      },
    ],
    keyTakeaway:
      'El cuerpo de cada persona es su territorio íntimo. No se comentan, ni se miden, ni se comparan los cuerpos de los demás. La empatía nos hace mejores personas y crea un aula segura.',
  },
  {
    id: 'sit-4',
    title: 'Mateo y el miedo a no haber "pegado el estirón"',
    protagonist: 'mateo',
    tag: 'Tiempos Propios',
    context: 'En el vestuario de educación física.',
    story:
      'Mateo vio que dos amigos de su equipo ya tienen la voz mucho más grave y crecieron casi diez centímetros en los últimos meses. Mateo se mira al espejo y siente que sigue casi igual que en 5.º grado. Se pregunta con angustia: "¿Tendré algún problema de salud? ¿Por qué a ellos sí y a mí no?".',
    guidingQuestions: [
      {
        question: '¿Qué le está pasando a Mateo por dentro?',
        hint: 'La comparación suele generar ansiedad.',
        possibleAnswers: [
          {
            text: 'Siente inseguridad y se compara, creyendo falsamente que hay un tiempo fijo para todos.',
            reflection: 'Muy cierto. Compararse con los amigos que empezaron antes genera una preocupación innecesaria.',
            isConstructive: true,
          },
        ],
      },
      {
        question: '¿Qué dato científico sobre la pubertad puede tranquilizar a Mateo?',
        hint: 'Recordá qué aprendimos en el Nivel 1 y 2.',
        possibleAnswers: [
          {
            text: 'La pubertad abarca un rango muy amplio (entre los 9 y los 14 o 15 años). Empezar antes o después es totalmente normal y saludable.',
            reflection: '¡Exacto! El reloj biológico de cada uno está programado por su propia genética y desarrollo.',
            isConstructive: true,
          },
        ],
      },
      {
        question: '¿Con quién le vendría bien conversar sobre sus dudas?',
        hint: 'Los adultos de confianza están para acompañar.',
        possibleAnswers: [
          {
            text: 'Con su familia, su pediatra o el profe de educación física, quienes le explicarán con calma cómo funciona el crecimiento.',
            reflection: '¡Tal cual! Preguntar a adultos de confianza disuelve los miedos mucho mejor que quedarse rumiando solo.',
            isConstructive: true,
          },
        ],
      },
    ],
    keyTakeaway:
      'No hay cuerpos "atrasados" ni "apurados". La naturaleza humana tiene una enorme diversidad de ritmos; todos los tiempos son válidos.',
  },
];

export const DETECTIVE_QUESTIONS: DetectiveQuestion[] = [
  {
    id: 'det-1',
    situation: 'A Lucía le salieron varios granitos en la frente y nota que transpira con un olor diferente después de correr en el recreo.',
    character: 'Lucía (11 años)',
    options: [
      {
        type: 'physical',
        label: 'A. Cambio Físico',
        explanation: 'Las glándulas sebáceas y sudoríparas aumentan su actividad por estímulo hormonal, modificando la piel y el olor corporal.',
        isCorrectOrValid: true,
      },
      {
        type: 'emotional',
        label: 'B. Cambio Emocional',
        explanation: 'Aunque puede generar vergüenza o timidez, el hecho central descripto es una transformación corporal de la piel y glándulas.',
        isCorrectOrValid: false,
      },
      {
        type: 'relational',
        label: 'C. Cambio Vincular',
        explanation: 'No describe una relación con amigos o familia, sino una modificación biológica.',
        isCorrectOrValid: false,
      },
      {
        type: 'combined',
        label: 'D. Puede involucrar más de uno',
        explanation: '¡Muy bien fundamentado! Es principalmente físico, pero si a Lucía le da pudor frente a sus amigas, también roza lo emocional y vincular.',
        isCorrectOrValid: true,
      },
    ],
    takeaway: 'La actividad de la piel y el sudor es un cambio físico típico que requiere higiene diaria con agua y jabón, y puede despertar emociones de pudor.',
  },
  {
    id: 'det-2',
    situation: 'Tomás no sabe bien por qué, pero hoy siente muchas ganas de llorar por una tontería y a la media hora se siente súper entusiasmado escuchando música.',
    character: 'Tomás (12 años)',
    options: [
      {
        type: 'physical',
        label: 'A. Cambio Físico',
        explanation: 'No se describe una modificación visible del cuerpo, sino estados de ánimo internos.',
        isCorrectOrValid: false,
      },
      {
        type: 'emotional',
        label: 'B. Cambio Emocional',
        explanation: '¡Correcto! Los cambios en la intensidad del ánimo y la sensibilidad emocional son típicos de esta etapa de maduración.',
        isCorrectOrValid: true,
      },
      {
        type: 'relational',
        label: 'C. Cambio Vincular',
        explanation: 'Se enfoca en lo que Tomás siente por dentro más que en una interacción con pares.',
        isCorrectOrValid: false,
      },
      {
        type: 'combined',
        label: 'D. Puede involucrar más de uno',
        explanation: 'Válido si consideramos que las hormonas corporales influyen en el sistema nervioso.',
        isCorrectOrValid: true,
      },
    ],
    takeaway: 'La oscilación y profundidad de las emociones forman parte del descubrimiento de nuestra personalidad en la pubertad.',
  },
  {
    id: 'det-3',
    situation: 'Camila empezó a elegir juntarse con un grupo nuevo que comparte su amor por el dibujo manga, pero su amiga de primer grado se siente celosa y discuten a menudo.',
    character: 'Camila (11 años)',
    options: [
      {
        type: 'physical',
        label: 'A. Cambio Físico',
        explanation: 'No hay modificaciones biológicas en esta situación.',
        isCorrectOrValid: false,
      },
      {
        type: 'emotional',
        label: 'B. Cambio Emocional',
        explanation: 'Hay sentimientos de celos y tristeza, pero la situación central trata sobre cómo se organizan las amistades y los grupos.',
        isCorrectOrValid: false,
      },
      {
        type: 'relational',
        label: 'C. Cambio Vincular',
        explanation: '¡Excelente! Los vínculos, la reorganización de amistades y la gestión de celos o nuevos grupos son cambios vinculares puros.',
        isCorrectOrValid: true,
      },
      {
        type: 'combined',
        label: 'D. Puede involucrar más de uno',
        explanation: '¡Totalmente! Cambian los vínculos (relaciones) y a la vez despierta emociones profundas de celos o necesidad de libertad.',
        isCorrectOrValid: true,
      },
    ],
    takeaway: 'Hacer nuevos amigos no significa descartar a los anteriores; aprender a combinar espacios de afecto es un gran aprendizaje vincular.',
  },
  {
    id: 'det-4',
    situation: 'A Joaquín le empezó a cambiar el tono de voz: a veces le sale grave y de repente se le quiebra. Por eso, en la clase de lengua le dio vergüenza leer en voz alta frente a todos.',
    character: 'Joaquín (12 años)',
    options: [
      {
        type: 'physical',
        label: 'A. Cambio Físico',
        explanation: 'El crecimiento de la laringe cambia la voz, lo cual es físico.',
        isCorrectOrValid: true,
      },
      {
        type: 'emotional',
        label: 'B. Cambio Emocional',
        explanation: 'La vergüenza y timidez que siente al leer es emocional.',
        isCorrectOrValid: true,
      },
      {
        type: 'relational',
        label: 'C. Cambio Vincular',
        explanation: 'El temor al juicio de los compañeros involucra la relación con el grupo.',
        isCorrectOrValid: true,
      },
      {
        type: 'combined',
        label: 'D. Involucra más de uno (¡Combinado!)',
        explanation: '¡Respuesta ideal! Comienza con un cambio físico (la voz), genera una emoción (vergüenza) y repercute en su relación con el grupo escolar.',
        isCorrectOrValid: true,
      },
    ],
    takeaway: 'Los cambios físicos, emocionales y vinculares muchas veces se entrelazan: el cuerpo cambia, sentimos cosas al respecto y eso influye en cómo interactuamos.',
  },
  {
    id: 'det-5',
    situation: 'Mariana le pide a su mamá que toque la puerta antes de entrar a su pieza y que respete cuando la puerta está cerrada.',
    character: 'Mariana (12 años)',
    options: [
      {
        type: 'physical',
        label: 'A. Cambio Físico',
        explanation: 'No refiere a una alteración anatómica directa.',
        isCorrectOrValid: false,
      },
      {
        type: 'emotional',
        label: 'B. Cambio Emocional',
        explanation: 'Refleja la necesidad subjetiva de intimidad y autoconocimiento.',
        isCorrectOrValid: true,
      },
      {
        type: 'relational',
        label: 'C. Cambio Vincular',
        explanation: 'Establece un nuevo límite y acuerdo de convivencia con la familia en pos de mayor autonomía.',
        isCorrectOrValid: true,
      },
      {
        type: 'combined',
        label: 'D. Involucra más de uno',
        explanation: '¡Exacto! Es emocional (necesidad de intimidad) y vincular (establecer acuerdos y límites claros con los padres).',
        isCorrectOrValid: true,
      },
    ],
    takeaway: 'Pedir privacidad no es esconder cosas malas: es construir un espacio propio de intimidad saludable mientras crecemos.',
  },
];

export const TEACHER_GUIDE = {
  title: 'Guía Didáctica para el Docente — ESI en 6.º Grado',
  purpose:
    'Esta aplicación fue diseñada según los lineamientos de la Educación Sexual Integral (Ley 26.150 y diseños curriculares jurisdiccionales) para 6.º año de Nivel Primario. Busca desmitificar la pubertad, promover el autoconocimiento sin estereotipos y fortalecer la empatía colectiva.',
  didacticMoments: [
    {
      stage: 'Momento 1: Apertura y Sensibilización',
      suggestedActivity:
        'Lectura del mensaje central con el grupo. Presentar a Sofía y Mateo como compañeros de 6.º grado que también tienen dudas. Realizar una lluvia de ideas sobre qué significa crecer sin juzgar ninguna intervención.',
    },
    {
      stage: 'Momento 2: Diferenciación de Cambios',
      suggestedActivity:
        'Trabajar el "Detective de Cambios" en parejas o de a cuatro. Destacar que los cambios no son solo físicos: las emociones y los vínculos se transforman profundamente. Reforzar que no existe un "cuerpo normal" único.',
    },
    {
      stage: 'Momento 3: Análisis de Situaciones Cotidianas',
      suggestedActivity:
        'Proyectar las situaciones de Sofía y Mateo usando el "Modo Proyector". Debatir la diferencia entre un desacuerdo y una agresión, y acordar colectivamente la pauta de respeto: nunca opinar sobre cuerpos ajenos.',
    },
    {
      stage: 'Momento 4: Buzón de Preguntas',
      suggestedActivity:
        'Invitar a los estudiantes a formular preguntas en el buzón. Garantizar el anonimato. El docente puede revisar desde su panel las dudas más recurrentes para retomarlas en la puesta en común.',
    },
    {
      stage: 'Momento 5: Habilitación del Expediente 2 (Criterio Docente)',
      suggestedActivity:
        'Cuando el grupo haya asimilado los aspectos corporales, emocionales y de cuidado mutuo, el docente puede habilitar el Expediente 2 para abordar la dimensión biológica reproductiva con rigor conceptual y respeto.',
    },
  ],
};

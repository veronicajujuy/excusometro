export interface ExcuseComponent {
  id: string;
  text: string;
  emoji: string;
  tag: string;
  intensity: number; // 1 to 5 absurdity level
}

export interface RecipientPreset {
  id: string;
  name: string;
  role: string;
  emoji: string;
  prefix: string;
  suffix: string;
}

export const RECIPIENTS: RecipientPreset[] = [
  {
    id: 'jefe',
    name: 'Para el Jefe',
    role: 'Laboral',
    emoji: '👔',
    prefix: 'Estimado/a, le presento mis más sinceras disculpas por el retraso. El motivo es de fuerza mayor: ',
    suffix: ' Ya voy en camino con la laptop abierta para recuperar el tiempo.',
  },
  {
    id: 'amigos',
    name: 'A los Amigos',
    role: 'Social',
    emoji: '🍻',
    prefix: '¡Gente, no me maten! No van a creer el delirio cósmico que me acaba de pasar: ',
    suffix: ' Si no llego en 15 minutos, hagan un brindis por mi alma.',
  },
  {
    id: 'cita',
    name: 'Cita Romántica',
    role: 'Amor',
    emoji: '🌹',
    prefix: '¡Perdón amor de mi vida! Te juro por lo más sagrado que jamás te dejaría plantado/a, pero resulta que ',
    suffix: ' ¡Te juro que hoy pago yo la cena para compensarlo!',
  },
  {
    id: 'profe',
    name: 'Al Profesor',
    role: 'Académico',
    emoji: '🎓',
    prefix: 'Profesor/a, buenas tardes. Le ruego me permita ingresar al aula; mi ausencia involuntaria se debe a que ',
    suffix: ' Traigo las notas de la clase pasada como muestra de compromiso.',
  },
  {
    id: 'directo',
    name: 'Sin Vueltas',
    role: 'Crudo',
    emoji: '⚡',
    prefix: 'Llego tarde y con la frente en alto porque ',
    suffix: ' Fin del comunicado.',
  },
];

export const CHARACTERS: ExcuseComponent[] = [
  {
    id: 'c1',
    text: 'Un mapache con diploma de electricista matriculado',
    emoji: '🦝',
    tag: 'Animales',
    intensity: 4,
  },
  {
    id: 'c2',
    text: 'Mi gato que aprendió a solicitar préstamos bancarios',
    emoji: '🐱',
    tag: 'Mascotas',
    intensity: 3,
  },
  {
    id: 'c3',
    text: 'Un grupo de monjes tibetanos en monopatín eléctrico',
    emoji: '🧘‍♂️',
    tag: 'Místico',
    intensity: 4,
  },
  {
    id: 'c4',
    text: 'Una señora de 92 años haciendo parkour en el palier',
    emoji: '👵',
    tag: 'Vecinos',
    intensity: 4,
  },
  {
    id: 'c5',
    text: 'Un astronauta de la era soviética perdido en bicicleta',
    emoji: '👨‍🚀',
    tag: 'Espacial',
    intensity: 5,
  },
  {
    id: 'c6',
    text: 'El clon malvado de mi jefe venido del año 2049',
    emoji: '🦹',
    tag: 'Ciencia Ficción',
    intensity: 5,
  },
  {
    id: 'c7',
    text: 'Una bandada de palomas con handies y walkie-talkies',
    emoji: '🕊️',
    tag: 'Conspiración',
    intensity: 4,
  },
  {
    id: 'c8',
    text: 'Un mariachi solitario que musicalizaba mis dudas existenciales',
    emoji: '🎺',
    tag: 'Musical',
    intensity: 3,
  },
  {
    id: 'c9',
    text: 'El mismísimo fantasma de mi tatarabuelo que vino a juzgarme',
    emoji: '👻',
    tag: 'Sobrenatural',
    intensity: 3,
  },
  {
    id: 'c10',
    text: 'Un robot de cocina inteligente que se declaró en huelga',
    emoji: '🤖',
    tag: 'Tecnología',
    intensity: 4,
  },
  {
    id: 'c11',
    text: 'El inspector municipal de baldosas flojas y crujientes',
    emoji: '🕵️',
    tag: 'Burocracia',
    intensity: 2,
  },
  {
    id: 'c12',
    text: 'Un vikingo sonámbulo con un hacha de plástico inflable',
    emoji: '🛡️',
    tag: 'Épico',
    intensity: 4,
  },
  {
    id: 'c13',
    text: 'Una paloma que decía ser mi abogada defensora',
    emoji: '🐦',
    tag: 'Legal',
    intensity: 5,
  },
  {
    id: 'c14',
    text: 'Un delivery en patines que trajo una pizza de otra dimensión',
    emoji: '🍕',
    tag: 'Urbano',
    intensity: 4,
  },
  {
    id: 'c15',
    text: 'Un duende sindicalista que bloqueó la puerta de mi casa',
    emoji: '🧝',
    tag: 'Gremial',
    intensity: 4,
  },
  {
    id: 'c16',
    text: 'Un loro bilingüe que repetía secretos de estado en mi ventana',
    emoji: '🦜',
    tag: 'Espionaje',
    intensity: 3,
  },
  {
    id: 'c17',
    text: 'Una iguana con corbata y maletín de ejecutivo agresivo',
    emoji: '🦎',
    tag: 'Finanzas',
    intensity: 4,
  },
  {
    id: 'c18',
    text: 'Un influencer de meditación que me atrapó en su directo de TikTok',
    emoji: '📱',
    tag: 'Viral',
    intensity: 3,
  },
  {
    id: 'c19',
    text: 'Un mago callejero que hizo desaparecer mi zapato izquierdo',
    emoji: '🎩',
    tag: 'Ilusión',
    intensity: 3,
  },
  {
    id: 'c20',
    text: 'Un perro salchicha con chaleco de tránsito municipal',
    emoji: '🌭',
    tag: 'Mascotas',
    intensity: 3,
  },
  {
    id: 'c21',
    text: 'Un doble idéntico a mí pero con bigote falso y sombrero de copa',
    emoji: '🥸',
    tag: 'Multiverso',
    intensity: 5,
  },
  {
    id: 'c22',
    text: 'Un científico desquiciado que calibraba un acelerador en el zaguán',
    emoji: '🧪',
    tag: 'Ciencia',
    intensity: 5,
  },
  {
    id: 'c23',
    text: 'Un filósofo griego con sandalias que me cuestionó la prisa',
    emoji: '🏛️',
    tag: 'Filosofía',
    intensity: 3,
  },
  {
    id: 'c24',
    text: 'Una patota de conejos con anteojos oscuros y camperas de cuero',
    emoji: '🐰',
    tag: 'Mafia Animal',
    intensity: 4,
  },
  {
    id: 'c25',
    text: 'Un mimo profesional que me encerró en una caja invisible',
    emoji: '🤡',
    tag: 'Teatro',
    intensity: 4,
  },
];

export const SITUATIONS: ExcuseComponent[] = [
  {
    id: 's1',
    text: 'organizó un piquete exigiendo salmón ahumado y café de especialidad',
    emoji: '🍣',
    tag: 'Conflicto',
    intensity: 3,
  },
  {
    id: 's2',
    text: 'me retó a un duelo a muerte con espadas de tubos de cartón',
    emoji: '⚔️',
    tag: 'Combate',
    intensity: 4,
  },
  {
    id: 's3',
    text: 'confundió mis llaves con una reliquia inca y las enterró en la maceta',
    emoji: '🏺',
    tag: 'Arqueología',
    intensity: 4,
  },
  {
    id: 's4',
    text: 'me hipnotizó cantando reggaetón en latín antiguo durante 40 minutos',
    emoji: '🌀',
    tag: 'Hipnosis',
    intensity: 5,
  },
  {
    id: 's5',
    text: 'se atrincheró en el ascensor exigiendo clave de wifi y masajes capilares',
    emoji: '🛗',
    tag: 'Rehenes',
    intensity: 3,
  },
  {
    id: 's6',
    text: 'me obligó a completar un censo interestelar de pelusas de bolsillo',
    emoji: '📋',
    tag: 'Trámites',
    intensity: 4,
  },
  {
    id: 's7',
    text: 'intentó arreglar mi despertador usando mayonesa y cables pelados',
    emoji: '⏰',
    tag: 'Chapucería',
    intensity: 4,
  },
  {
    id: 's8',
    text: 'declaró mi pasillo como territorio soberano de la República de Narnia',
    emoji: '🚩',
    tag: 'Geopolítica',
    intensity: 4,
  },
  {
    id: 's9',
    text: 'empezó a negociar un tratado de no agresión con las hormigas del zócalo',
    emoji: '🐜',
    tag: 'Diplomacia',
    intensity: 3,
  },
  {
    id: 's10',
    text: 'quedó atrapado en el lavarropas en modo centrifugado cuántico',
    emoji: '🌀',
    tag: 'Física',
    intensity: 5,
  },
  {
    id: 's11',
    text: 'me confiscó los pantalones alegando sospechas de contrabando textil',
    emoji: '👖',
    tag: 'Aduana',
    intensity: 4,
  },
  {
    id: 's12',
    text: 'instaló un peaje clandestino en la puerta cobrando galletitas Oreo',
    emoji: '🍪',
    tag: 'Peaje',
    intensity: 3,
  },
  {
    id: 's13',
    text: 'me desafió a una partida de piedra, papel o tijera a 99 rondas seguidas',
    emoji: '✂️',
    tag: 'Juegos',
    intensity: 4,
  },
  {
    id: 's14',
    text: 'declaró que el piso era lava volcánica real y me prohibió pisarlo',
    emoji: '🌋',
    tag: 'Supervivencia',
    intensity: 4,
  },
  {
    id: 's15',
    text: 'se comió la primera página de mi agenda para absorber mis compromisos',
    emoji: '📄',
    tag: 'Místico',
    intensity: 4,
  },
  {
    id: 's16',
    text: 'me envolvió la mochila en 14 capas de papel film industrial',
    emoji: '📦',
    tag: 'Maldad',
    intensity: 3,
  },
  {
    id: 's17',
    text: 'comenzó un ritual chamánico para invocar un colectivo que no viniera lleno',
    emoji: '🚌',
    tag: 'Transporte',
    intensity: 4,
  },
  {
    id: 's18',
    text: 'descalibró la gravedad de mi cocina arrojando tostadas con mermelada',
    emoji: '🍞',
    tag: 'Gravedad',
    intensity: 5,
  },
  {
    id: 's19',
    text: 'inició un debate teológico sobre por qué las medias pierden a su pareja',
    emoji: '🧦',
    tag: 'Misterio',
    intensity: 3,
  },
  {
    id: 's20',
    text: 'me pegó un código QR en la frente que redirigía a un video de gatitos',
    emoji: '🐱',
    tag: 'Cyber',
    intensity: 3,
  },
  {
    id: 's21',
    text: 'convocó a una asamblea vecinal urgente para votar el color de los nubarrones',
    emoji: '☁️',
    tag: 'Consorcio',
    intensity: 4,
  },
  {
    id: 's22',
    text: 'puso a hervir agua pesada en la pava para preparar mate radiactivo',
    emoji: '🧉',
    tag: 'Química',
    intensity: 4,
  },
  {
    id: 's23',
    text: 'me retuvo como rehén leyéndome los términos y condiciones de iTunes en voz alta',
    emoji: '📜',
    tag: 'Tortura',
    intensity: 4,
  },
  {
    id: 's24',
    text: 'organizó un torneo relámpago de escondite y se escondió con mi billetera',
    emoji: '🙈',
    tag: 'Traición',
    intensity: 4,
  },
  {
    id: 's25',
    text: 'hizo un nudo marinero triple con los cordones de mis dos zapatillas',
    emoji: '👟',
    tag: 'Trampas',
    intensity: 3,
  },
];

export const ENDINGS: ExcuseComponent[] = [
  {
    id: 'e1',
    text: 'así que tuve que cantar el himno nacional en reversa para poder salir',
    emoji: '🎵',
    tag: 'Canto',
    intensity: 4,
  },
  {
    id: 'e2',
    text: 'y no pude avanzar hasta firmarle un pagaré con un dibujo de Pikachu',
    emoji: '⚡',
    tag: 'Legal',
    intensity: 4,
  },
  {
    id: 'e3',
    text: 'por lo que debí negociar durante 45 minutos usando mímica y bizcochitos',
    emoji: '🥐',
    tag: 'Negociación',
    intensity: 3,
  },
  {
    id: 'e4',
    text: 'y terminé declarando como testigo protegido ante la policía de los sueños',
    emoji: '👮',
    tag: 'Onírico',
    intensity: 5,
  },
  {
    id: 'e5',
    text: 'entonces tuve que esperar a que el chamán del consorcio levantara el maleficio',
    emoji: '🔮',
    tag: 'Magia',
    intensity: 4,
  },
  {
    id: 'e6',
    text: 'y cuando finalmente salí a la calle, una gaviota me robó la tarjeta SUBE',
    emoji: '💳',
    tag: 'Robo',
    intensity: 4,
  },
  {
    id: 'e7',
    text: 'así que vine corriendo descalzo sorteando portales dimensionales en la vereda',
    emoji: '🏃',
    tag: 'Carrera',
    intensity: 5,
  },
  {
    id: 'e8',
    text: 'y tuve que cocinarles una tortilla de papas a todos para sellar la paz mundial',
    emoji: '🥔',
    tag: 'Cocina',
    intensity: 3,
  },
  {
    id: 'e9',
    text: 'por lo que mi reloj biológico y el satelital sufrieron un desfase de 38 minutos',
    emoji: '⏳',
    tag: 'Relatividad',
    intensity: 4,
  },
  {
    id: 'e10',
    text: 'y quedé varado esperando que la grúa cósmica remolcara mi dignidad',
    emoji: '🛸',
    tag: 'Drama',
    intensity: 4,
  },
  {
    id: 'e11',
    text: 'así que tuve que pedirle prestado el monopatín a un nene a cambio de caramelos',
    emoji: '🛴',
    tag: 'Transporte',
    intensity: 3,
  },
  {
    id: 'e12',
    text: 'y terminé firmando un pacto de no agresión con una milanesa fría',
    emoji: '🥩',
    tag: 'Gastronómico',
    intensity: 4,
  },
  {
    id: 'e13',
    text: 'por lo que el universo se reinició y tuve que esperar a que cargara el sistema solar',
    emoji: '🌌',
    tag: 'Cosmológico',
    intensity: 5,
  },
  {
    id: 'e14',
    text: 'y me vi forzado a simular un desmayo dramático de telenovela para escapar',
    emoji: '🎭',
    tag: 'Actuación',
    intensity: 3,
  },
  {
    id: 'e15',
    text: 'así que debí resolver un acertijo milenario sobre mandarinas para que abrieran la reja',
    emoji: '🍊',
    tag: 'Enigma',
    intensity: 4,
  },
  {
    id: 'e16',
    text: 'y terminé aprendiendo a tejer crochet bajo amenaza para no herir sus sentimientos',
    emoji: '🧶',
    tag: 'Manualidades',
    intensity: 3,
  },
  {
    id: 'e17',
    text: 'por lo que tuve que hacer marcha atrás durante 12 cuadras para no llamar la atención',
    emoji: '🔄',
    tag: 'Sigilo',
    intensity: 4,
  },
  {
    id: 'e18',
    text: 'y cuando creí que todo terminaba, llovió confeti fluorescente y quedé ciego 10 minutos',
    emoji: '🎊',
    tag: 'Fiesta',
    intensity: 4,
  },
  {
    id: 'e19',
    text: 'así que debí bautizar a tres caniches con nombres de próceres para calmar los ánimos',
    emoji: '🐩',
    tag: 'Cultura',
    intensity: 4,
  },
  {
    id: 'e20',
    text: 'y terminé siendo nombrado presidente honorario de una secta de amantes del brócoli',
    emoji: '🥦',
    tag: 'Liderazgo',
    intensity: 5,
  },
  {
    id: 'e21',
    text: 'por lo que tuve que esperar a que el pegamento extra fuerte secara por completo',
    emoji: '🧪',
    tag: 'Química',
    intensity: 3,
  },
  {
    id: 'e22',
    text: 'y me tocó rescatar a un periquito que se había atragantado con mi credencial laboral',
    emoji: '🦜',
    tag: 'Heroísmo',
    intensity: 3,
  },
  {
    id: 'e23',
    text: 'así que tuve que sobornar al chofer del colectivo con un alfajor triple de dulce de leche',
    emoji: '🚌',
    tag: 'Urbano',
    intensity: 3,
  },
  {
    id: 'e24',
    text: 'y terminé teniendo una revelación espiritual sobre la futilidad de la puntualidad',
    emoji: '🧘',
    tag: 'Zen',
    intensity: 4,
  },
  {
    id: 'e25',
    text: 'por lo que tuve que salir por la ventana del patio trepando por la enredadera de la vecina',
    emoji: '🧗',
    tag: 'Aventura',
    intensity: 4,
  },
];

export interface GeneratedExcuse {
  id: string;
  timestamp: number;
  character: ExcuseComponent;
  situation: ExcuseComponent;
  ending: ExcuseComponent;
  recipient: RecipientPreset;
  fullText: string;
  absurdityScore: number; // e.g. 85-99
  credibilityScore: number; // e.g. 0.1-5.0
  verdict: string;
  isFavorite?: boolean;
}

export function calculateAbsurdity(c: ExcuseComponent, s: ExcuseComponent, e: ExcuseComponent): {
  absurdity: number;
  credibility: number;
  verdict: string;
  risk: string;
} {
  const totalIntensity = c.intensity + s.intensity + e.intensity; // 6 to 15
  const basePercent = Math.min(99.9, Math.max(72.0, 70 + (totalIntensity / 15) * 28 + (Math.random() * 2)));
  const credibility = Math.max(0.1, +(100 - basePercent).toFixed(1));
  const absurdity = +(basePercent).toFixed(1);

  let verdict = 'Altamente sospechosa pero digna de aplauso.';
  let risk = 'Moderado: Si lo contás con convicción zafás';

  if (absurdity > 96) {
    verdict = 'Absurdo cuántico. O te despiden o te dan un premio Nobel de literatura.';
    risk = 'Crítico: Requiere lágrimas reales y mirada perdida';
  } else if (absurdity > 90) {
    verdict = 'Delirio cinematográfico. Nadie puede inventar algo tan específico sin que sea real.';
    risk = 'Alto: Tené fotos de mapaches a mano por si piden pruebas';
  } else if (absurdity > 82) {
    verdict = 'Excusa surrealista clásica. Deja a quien la escucha confundido y sin argumentos.';
    risk = 'Medio: Cambiá de tema rápido apenas termines la frase';
  } else {
    verdict = 'Borderline creíble en una comedia de enredos.';
    risk = 'Bajo: Zafás con un café de disculpas';
  }

  return { absurdity, credibility, verdict, risk };
}

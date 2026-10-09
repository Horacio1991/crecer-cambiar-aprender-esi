export type ChangeType = 'physical' | 'emotional' | 'relational' | 'combined';

export interface LevelModule {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  iconName: string;
  summary: string;
  keyConcepts: {
    title: string;
    description: string;
    sofiaOrMateo?: 'sofia' | 'mateo';
    quote?: string;
  }[];
  diversityNote: string;
  reflectionPrompt: string;
}

export interface EverydaySituation {
  id: string;
  title: string;
  protagonist: 'sofia' | 'mateo' | 'compartida';
  context: string;
  story: string;
  guidingQuestions: {
    question: string;
    hint: string;
    possibleAnswers: {
      text: string;
      reflection: string;
      isConstructive: boolean;
    }[];
  }[];
  keyTakeaway: string;
  tag: 'Privacidad y Emociones' | 'Amistad y Desacuerdos' | 'Respeto al Cuerpo' | 'Límites y Grupos' | 'Tiempos Propios';
}

export interface DetectiveQuestion {
  id: string;
  situation: string;
  character: string;
  options: {
    type: ChangeType;
    label: string;
    explanation: string;
    isCorrectOrValid: boolean;
  }[];
  takeaway: string;
}

export interface StudentQuery {
  id: string;
  timestamp: number;
  question: string;
  category: string;
  answer: string;
  companionQuote?: string;
  reflectionQuestion?: string;
  reproductionBlocked?: boolean;
}

export interface TeacherSettings {
  reproductionUnlocked: boolean;
  pin: string;
  activeSituations: string[];
}

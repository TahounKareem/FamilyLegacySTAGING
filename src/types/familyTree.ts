export interface FamilyEvent {
  id: string;
  date: string;
  type: string;
  title: string;
}

export interface FamilyMedia {
  id: string;
  url: string;
  title: string;
  description: string;
  type: 'image' | 'document' | 'audio' | 'video';
}

export interface FamilyMember {
  id: string;
  firstName: string;
  lastName?: string; // Kept for backward compatibility
  titles?: string[]; // اللقب
  nickname?: string; // الكنية
  
  // Flags
  noDescendants?: boolean; // لم يعقب
  femaleDominated?: boolean; // مئناث
  isFamous?: boolean; // من المشاهير والأعلام

  gender: 'male' | 'female' | 'unknown';
  religion?: string;
  ethnicity?: string;
  languages?: string[];
  
  profession?: string;
  birthPlace?: string;
  
  birthDate?: string;
  deathDate?: string;
  
  events?: FamilyEvent[];
  bio?: string;
  media?: FamilyMedia[];
  
  photoUrl?: string;
  // For UI positioning
  x: number;
  y: number;
}

export interface FamilyRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'parent' | 'child' | 'spouse' | 'sibling';
}


export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'unknown';
  birthDate?: string;
  deathDate?: string;
  birthPlace?: string;
  profession?: string;
  bio?: string;
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

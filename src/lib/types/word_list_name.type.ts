/*export type WordListWord = {
    count: number;
    lemma: string;
    pos: string;
}*/

export type Kwic = [string[], string];

export type Form = {
  form: string;
  pos: string;
  kwics: Kwic[];
  count: number;
};

/* added gender, type, key */

export type Lemma = {
  lemma: string;
  pos: string;
  gender: string;
  type: string;
  key: string;
  cf: string[];
  forms: Record<string, Form>;
  count: number;
};

export type WordListWord = {
  count: number;
  forms: Form[];
  lemma: string;
  lemmas: Lemma[];
  pos: string;
};

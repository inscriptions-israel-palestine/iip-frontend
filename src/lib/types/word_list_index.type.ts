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

/* added type, key */

export type Lemma = {
  lemma: string;
  pos: string;
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

export type NestedWordList = {
  [key: string]: WordListWord;
};

export type Index = {
  title: WordListWord;
  military: WordListWord;
  ethnicon: WordListWord;
  relationship: WordListWord;
  location: WordListWord;
  date: WordListWord;
  occupation: WordListWord;
  measure: WordListWord;
  object: WordListWord;
  religious: WordListWord;
  other: WordListWord;
};

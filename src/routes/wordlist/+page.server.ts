// this package name is preposterous, but it's a very capable CSV parser
import papa from 'papaparse';
import camelcase from 'lodash.camelcase';
import xpath from 'xpath';
import xmldom from '@xmldom/xmldom';


// this constant corresponds to `LATIN_CSV_NEW_URL` in
// iip-production
const LATIN_CSV_URL =
    'https://raw.githubusercontent.com/Brown-University-Library/iip-word-lists/master/new-version/latinoutput_nounique.csv';

type CSVDataRow = {
    '': number,
    unnamed0: number,
    unnamed01: number,
    text: string,
    wordNumber: number,
    lineStart: number,
    lineEnd: number,
    normalized: string,
    language: string,
    number: number,
    posTaggerWord: string,
    partOfSpeech: string,
    partOfSpeechSecondaryInfo: string,
    posTaggerLemma: string,
    lemmatizerLemma: string,
};

export async function load() {
    const response = await fetch(LATIN_CSV_URL);
    const csv = await response.text();
    const parsedCsv = papa.parse(csv, {
        dynamicTyping: true,
        header: true,
        transformHeader: function (header) {
            return camelcase(header);
        }
    });
    const data = parsedCsv.data as CSVDataRow[];
    const words = data.filter(row => {
        const lemma = row.posTaggerLemma || '';
        return lemma.length > 0 && lemma.indexOf('?') === -1;
    }).reduce((acc, row, index, allRows) => {
        const { lemmatizerLemma, partOfSpeech, posTaggerLemma, posTaggerWord } = row;
        const lemma = posTaggerLemma.replace('|', ' | ');
        const lemmaKey = `${lemma} ${partOfSpeech}`
        const kwic = allRows.slice(index - 2 < 0 ? 0 : index - 2, index + 3).map(r => r.normalized).join(' ');

        acc[lemmaKey] = acc[lemmaKey] || {};
        acc[lemmaKey].count = (acc[lemmaKey].count || 0) + 1;
        acc[lemmaKey].lemma = lemma;
        acc[lemmaKey].pos = partOfSpeech;

        const forms = acc[lemmaKey].forms || {};
        const kwics = forms.kwics ? forms.kwics : [];

        const form = { form: posTaggerWord, pos: getAdditionalPosInfo(lemmatizerLemma), kwics: kwics.concat(kwic) }

        return acc;
    }, {} as any);

    return { words }
}

function getAdditionalPosInfo(lemmatizerLemma: string) {
    const doc = new xmldom.DOMParser().parseFromString(lemmatizerLemma, 'text/xml');
    const nodes = xpath.select("//word/entry/infl/pofs", doc);

}
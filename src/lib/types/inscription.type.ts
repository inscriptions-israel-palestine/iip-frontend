export type BibliographicEntry = {
    id: number;
    bibl_scope?: string;
    bibl_scope_unit?: string;
    ptr_target?: string;
    ptr_type?: string;
    raw_xml: string;
    xml_id: string;
}

export enum DisplayStatus {
    APPROVED = "approved",
    TO_CORRECT = "to correct",
    TO_APPROVE = "to approve"
}

export enum EditionType {
    DIPLOMATIC = "diplomatic",
    TRANSCRIPTION = "transcription",
    TRANSCRIPTION_SEGMENTED = "transcription_segmented",
    TRANSLATION = "translation"
}

export type Edition = {
    edition_type: EditionType;
    raw_xml: string;
    text: string;
}

export type Figure = {
    id: number;
    name: string;
    locus: string;
}

export type Image = {
    description?: string;
    graphic_url: string;
}

export type Language = {
    label: string;
    short_form: string;
}

export type Provenance = {
    id: number;
    placename: string;
}

export type Inscription = {
    id: number;
    bibliographic_entires: BibliographicEntry[];
    city: any;
    description?: string;
    dimensions?: any;
    display_status: DisplayStatus;
    editions?: Edition[];
    figures: Figure[];
    filename: string;
    images?: Image[];
    languages?: Language[];
    location_coordinates?: number[];
    location_metadata?: any;
    not_after?: string;
    not_before?: string;
    provenance?: Provenance;
    short_description?: string;
    title?: string;
}
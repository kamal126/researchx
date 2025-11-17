export interface Topic{
    mainTopic: string;
    documentLength: number; 
    outputFormat: 'DOCX' | 'PDF'; 
    topicDescription?: string; // Optional detailed description
    citationFormat?: string; // e.g., APA, MLA, Chicago
    academicLevel?: string; // e.g., High School, Undergraduate, Graduate
}

export interface SubTopic{
    id: string;
    title: string;
    isSelected: boolean;
    content?: string; // Optional content for the subtopic
}

export interface Section {
    id: string;
    title: string;
    isSelected: boolean;
    subtopics: SubTopic[];  //
}

export interface DocumentOutline {
    mainTopic: string;
    sections: Section[];
}
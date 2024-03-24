
export interface SearchResultItem {
    _id: string;
    _score: number;
    _source: {
        description: string;
        title: string;
        location: string;
        link: string;
    }
}

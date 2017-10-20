class SheetsResult extends Array{
    constructor(){
        super();
        this.title = "";
    }
}

export default class GoogleSheet {
    constructor(source, index){
        this.results = new SheetsResult();

        this.sourceUrl = 'https://spreadsheets.google.com/feeds/list/' + source + '/' + index + '/public/basic?alt=json';
    }

    getSheet(){
        let self = this;
        return fetch(self.sourceUrl)
            .then((response) => response.json())
            .then((json) => 
                self.jsonify(json)
            );
    }

    jsonify(json){
        for(let i = 0; i < json.feed.entry.length; i++) {
            let entry = json.feed.entry[i];

            let result = {};
            result["key"] = entry.title.$t;

            let entryData = entry.content.$t.split(', ');

            for(let j = 0; j< entryData.length; j++){
                let field = entryData[j].split(': ');

                if(!isNaN(field[1])) {
                    field[1] = Number(field[1]);
                }
                result[field[0]] = field[1];
            }

            this.results.push(result);
        }

        this.results.title = json.feed.title.$t;
    }

}


import {Injectable} from '@angular/core';
import {Term} from 'yacs-api-client';

@Injectable()
export class SelectedTermService {
    protected selectedTermId: string | null;
    protected validated: boolean;

    constructor () {
        Term.all().then(console.log);
        if (localStorage.getItem('selectedTerm') != null) {
            this.selectedTermId = localStorage.getItem('selectedTerm');
            this.validated = false;
        } else {
            this.selectedTermId = null;
            this.validated = true;
        }
    }

    async get (): Promise<string> {
        if (this.selectedTermId == null) { // selectedTermId == null, validated == any
            const id = (await Term.first()).data.id;
            this.selectedTermId = id;
            return id;
        } else if (!this.validated) { // selectedTermId != null, validated == false

            try {
                const validatedId = (await Term.find(this.selectedTermId)).data.id;
                this.validated = true;
                return validatedId;
            } catch (ex) {
                console.log('Cached term was not valid, resetting.');
                this.selectedTermId = (await Term.first()).data.id;
                this.validated = true;
                return this.selectedTermId;
            }
        } else { // selectedTermId != null, validated == true
            return this.selectedTermId;
        }
    }

    async getData (): Promise<Term> {
        const id = (await this.get());
        return (await Term.find(id)).data;
    }

}

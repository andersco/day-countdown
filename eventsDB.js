import googleDrive from './googleDrive';
import uuid from 'uuid';

export default class eventsDB {
    constructor(apiKey) {
        this.googleDrive = new googleDrive(apiKey);
    }

    async getEvents() {
        let events = await this.googleDrive.loadDataFile();
        return events;
    }

    async createEvent({ title, date }) {
        try {
            let events = await this.googleDrive.loadDataFile();
            let id = uuid(); 
            events[id] = { "title": title, "date": date };
            await this.googleDrive.saveDataFile(events);
        } catch (err) {
            console.log(err);
        }
    }

    async deleteEvent(id) {
        console.log('deleting ' + id);
        let events = await this.googleDrive.loadDataFile();
        delete events[id];
        await this.googleDrive.saveDataFile(events);
    }
}
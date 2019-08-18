import googleDrive from './googleDrive';
import uuid from 'uuid';

export default class eventsDB {
    constructor(apiKey) {
        this.googleDrive = new googleDrive(apiKey);
    }

    async getEvents() {
        let events = await this.googleDrive.loadDataFile();
        return events[0].events;
    }

    async createEvent({ title, date }) {
        try {
            let events = await this.googleDrive.loadDataFile();
            events[0].events.push({ "title": title, "date": date, id: uuid() })
            await this.googleDrive.saveDataFile(events);
        } catch (err) {
            console.log(err);
        }
    }

    async deleteEvent(id) {
        console.log('deleting ' + id);
    }
}
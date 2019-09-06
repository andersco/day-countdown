import googleDrive from './googleDrive';
import uuid from 'uuid';

export default class eventsDB {
    constructor() {
        this.googleDrive = new googleDrive();
    }

    async init() {
        await this.googleDrive.init();
    }

    async getEvents() {
        let events = await this.googleDrive.loadDataFile();
        return events;
    }

    async getEvent(id) {
        console.log('loading event with id ' + id);
        let events = await this.googleDrive.loadDataFile();
        return events[id];
    }

    async saveEvent(event) {
        console.log('saving ' + event.id);
        let events = await this.googleDrive.loadDataFile();
        events[event.id] = event;
        await this.googleDrive.saveDataFile(events);
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
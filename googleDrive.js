const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
const boundaryString = 'countdown_boundary'; // can be anything unique, needed for multipart upload https://developers.google.com/drive/v3/web/multipart-upload
import uuid from 'uuid';

export default class googleDrive {
    constructor(apiToken) {
        this.apiToken = apiToken;
    }

    // download data file
    async loadDataFile() {
        try {
            let content = [
                {
                }
            ];
            let file = await this.getFile();
            if (file) {
                let fileId = file.id;
                content = this.getFileContent(fileId);
            } else {
                console.log('file not found...uploading empty events list content');
                await this.uploadFile(JSON.stringify(content))
            }
            return content;
        } catch (error) {
            console.log('error: ' + error);
        }
    }

    async saveDataFile(events) {
        try {
            let file = await this.getFile();
            if (file) {
                await this.uploadFile(JSON.stringify(events), file.id);
            } else {
                throw new Error('Data file not found');
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getFile() {
        const qParams = encodeURIComponent("name = 'data.json'");
        const options = this.configureGetOptions();
        let response = await fetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options);
        let body = await this.parseAndHandleErrors(response);
        if (body && body.files && body.files.length > 0) {
            return body.files[0];
        } else {
            return null;
        }
    }

    getFileContent = async (id) => {
        try {
            const options = this.configureGetOptions();
            let data = await fetch(`${url}/files/${id}?alt=media`, options);
            let body = await this.parseAndHandleErrors(data);
            if (body) {
                body = JSON.parse(body);
                return body;
            }
            throw Error("Invalid content in file.");
        } catch (error) {
            console.log("Error: " + error);
        }
    };

    // upload file to google drive
    uploadFile = async (content, existingFileId) => {
        const body = this.createMultipartBody(content, !!existingFileId)
        const options = this.configurePostOptions(body.length, !!existingFileId)
        return fetch(`${uploadUrl}/files${existingFileId ? `/${existingFileId}` : ''}?uploadType=multipart`, {
            ...options,
            body,
        })
            .then(this.parseAndHandleErrors)
    }

    async parseAndHandleErrors(response) {
        if (response.ok) {
            let data = await response.json();
            return data
        } else {
            let message = await response.text();
            console.log(message);
            return message;
        }
    }

    createMultipartBody = (body, isUpdate = false) => {
        // https://developers.google.com/drive/v3/web/multipart-upload defines the structure
        const metaData = {
            name: 'data.json',
            description: 'Backup data for my app',
            mimeType: 'application/json',
        }
        // if it already exists, specifying parents again throws an error
        if (!isUpdate) metaData.parents = ['appDataFolder']

        // request body
        const multipartBody = `\r\n--${boundaryString}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`
            + `${JSON.stringify(metaData)}\r\n`
            + `--${boundaryString}\r\nContent-Type: application/json\r\n\r\n`
            + `${JSON.stringify(body)}\r\n`
            + `--${boundaryString}--`

        return multipartBody
    }

    configureGetOptions = () => {
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${this.apiToken}`)
        return {
            method: 'GET',
            headers,
        }
    }

    configurePostOptions = (bodyLength, isUpdate = false) => {
        const headers = new Headers()
        headers.append('Authorization', `Bearer ${this.apiToken}`)
        headers.append('Content-Type', `multipart/related; boundary=${boundaryString}`)
        headers.append('Content-Length', bodyLength)
        return {
            method: isUpdate ? 'PATCH' : 'POST',
            headers,
        }
    }
}
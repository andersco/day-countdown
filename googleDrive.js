const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
let apiToken = null
const boundaryString = 'countdown_boundary' // can be anything unique, needed for multipart upload https://developers.google.com/drive/v3/web/multipart-upload

// create file to upload
async function loadDataFile(apiToken) {
    try {
        this.apiToken = apiToken;
        let content = [
            {
                "events": [
                    {
                        "title": "From google drive",
                        "date": "2019-06-15T00:00:00.000Z",
                        "id": "05dafc66-bd91-43a0-a752-4dc40f039143"
                    }
                ]
            }
        ];
        let file = await getFile();
        if (file) {
            // this.uploadFile(JSON.stringify(content), file.id)
            console.log('found file');
            console.log('file', file);
            let fileId = file.id;
            content = getFileContent(fileId);
        } else {
            console.log('file not found...uploading');
            this.uploadFile(JSON.stringify(content))
        }
        return content;
    } catch (error) {
        console.log('error: ' + error);
    }
}

getFile = () => {
    const qParams = encodeURIComponent("name = 'data.json'");
    const options = this.configureGetOptions();
    return fetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options)
        .then(this.parseAndHandleErrors)
        .then((body) => {
            console.log(body)
            if (body && body.files && body.files.length > 0) return body.files[0]
            return null
        })
}

getFileContent = async (id) => {
    try {
        console.log('getting file ' + id);
        const options = this.configureGetOptions();
        let data = await fetch(`${url}/files/${id}?alt=media`, options);
        let body = await this.parseAndHandleErrors(data);
        console.log('file content:  ');
        console.log(body)
        if (body) {
            body = JSON.parse(body);
            if (body.length > 0 && body[0].events) {
                return body[0].events;
            }
        }
        throw Error("invalid content in file");
    } catch (error) {
        console.log("Error: " + error);
    }
};

// upload file to google drive
uploadFile = (content, existingFileId) => {
    const body = this.createMultipartBody(content, !!existingFileId)
    const options = this.configurePostOptions(body.length, !!existingFileId)
    return fetch(`${uploadUrl}/files${existingFileId ? `/${existingFileId}` : ''}?uploadType=multipart`, {
        ...options,
        body,
    })
        .then(this.parseAndHandleErrors)
}

parseAndHandleErrors = async (response) => {
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

export { loadDataFile };
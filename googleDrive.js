const url = 'https://www.googleapis.com/drive/v3';
const uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
let apiToken = null
const boundaryString = 'countdown_boundary' // can be anything unique, needed for multipart upload https://developers.google.com/drive/v3/web/multipart-upload

// create file to upload
async function createFile (apiToken) {
    this.apiToken = apiToken;
    const content = [
        {
            id: 1,
            text: 'transaction memo list',
            name: 'dang'
        },
        {
            id: 2,
            text: 'transaction memo list',
            name: 'dang 23'
        }
    ]
    this.getFile().then((file) => {
        console.log('file', file)
        if (file) {
            this.uploadFile(JSON.stringify(content), file.id)
        } else {
            this.uploadFile(JSON.stringify(content))
        }
    }).catch((error) => {
        console.log('error', error)
    })
}

getFile = () => {
    const qParams = encodeURIComponent("name = 'data.json'");
    const options = this.configureGetOptions();
    console.log('options', this.apiToken);
    return fetch(`${url}/files?q=${qParams}&spaces=appDataFolder`, options)
        .then(this.parseAndHandleErrors)
        .then((body) => {
            console.log(body)
            if (body && body.files && body.files.length > 0) return body.files[0]
            return null
        })
}

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
        console.log(data);
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

export { createFile };